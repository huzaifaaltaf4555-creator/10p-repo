using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;
using TaskManager.API.Models;

namespace TaskManager.API.Repositories
{
    /// <summary>
    /// EF Core implementation of the task repository.
    /// Handles all database operations for tasks.
    /// </summary>
    public class TaskRepository : ITaskRepository
    {
        private readonly AppDbContext _context;

        public TaskRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets all tasks with filtering, search, and pagination.
        /// </summary>
        public async Task<PagedResult<TaskItem>> GetAllAsync(TaskQueryDto query)
        {
            var queryable = _context.TaskItems
                .Include(t => t.AssignedUser)
                .AsQueryable();

            queryable = ApplyFilters(queryable, query);

            var totalCount = await queryable.CountAsync();

            var items = await queryable
                .OrderByDescending(t => t.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResult<TaskItem>
            {
                Items = items,
                TotalCount = totalCount,
                Page = query.Page,
                PageSize = query.PageSize
            };
        }

        /// <summary>
        /// Gets tasks for a specific user with filtering, search, and pagination.
        /// </summary>
        public async Task<PagedResult<TaskItem>> GetByUserIdAsync(string userId, TaskQueryDto query)
        {
            var queryable = _context.TaskItems
                .Include(t => t.AssignedUser)
                .Where(t => t.AssignedUserId == userId)
                .AsQueryable();

            queryable = ApplyFilters(queryable, query);

            var totalCount = await queryable.CountAsync();

            var items = await queryable
                .OrderByDescending(t => t.CreatedAt)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return new PagedResult<TaskItem>
            {
                Items = items,
                TotalCount = totalCount,
                Page = query.Page,
                PageSize = query.PageSize
            };
        }

        /// <summary>
        /// Gets a single task by ID, including the assigned user.
        /// </summary>
        public async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _context.TaskItems
                .Include(t => t.AssignedUser)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        /// <summary>
        /// Creates a new task in the database.
        /// </summary>
        public async Task<TaskItem> CreateAsync(TaskItem task)
        {
            _context.TaskItems.Add(task);
            await _context.SaveChangesAsync();

            // Reload with navigation property
            return await _context.TaskItems
                .Include(t => t.AssignedUser)
                .FirstAsync(t => t.Id == task.Id);
        }

        /// <summary>
        /// Updates an existing task.
        /// </summary>
        public async Task<TaskItem?> UpdateAsync(TaskItem task)
        {
            _context.TaskItems.Update(task);
            await _context.SaveChangesAsync();

            return await _context.TaskItems
                .Include(t => t.AssignedUser)
                .FirstOrDefaultAsync(t => t.Id == task.Id);
        }

        /// <summary>
        /// Deletes a task by ID.
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _context.TaskItems.FindAsync(id);
            if (task == null) return false;

            _context.TaskItems.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Gets task count statistics grouped by status.
        /// </summary>
        public async Task<TaskStatsDto> GetStatsAsync(string? userId = null)
        {
            var queryable = _context.TaskItems.AsQueryable();

            if (!string.IsNullOrEmpty(userId))
            {
                queryable = queryable.Where(t => t.AssignedUserId == userId);
            }

            var stats = new TaskStatsDto
            {
                Completed = await queryable.CountAsync(t => t.Status == TaskStatusEnum.Completed),
                InProgress = await queryable.CountAsync(t => t.Status == TaskStatusEnum.InProgress),
                Pending = await queryable.CountAsync(t => t.Status == TaskStatusEnum.Pending)
            };

            return stats;
        }

        /// <summary>
        /// Applies search and filter logic to a queryable.
        /// </summary>
        private static IQueryable<TaskItem> ApplyFilters(IQueryable<TaskItem> queryable, TaskQueryDto query)
        {
            // Search by title or description
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var searchTerm = query.Search.ToLower();
                queryable = queryable.Where(t =>
                    t.Title.ToLower().Contains(searchTerm) ||
                    t.Description.ToLower().Contains(searchTerm));
            }

            // Filter by status
            if (!string.IsNullOrWhiteSpace(query.Status) &&
                Enum.TryParse<TaskStatusEnum>(query.Status, true, out var statusEnum))
            {
                queryable = queryable.Where(t => t.Status == statusEnum);
            }

            // Filter by priority
            if (!string.IsNullOrWhiteSpace(query.Priority) &&
                Enum.TryParse<TaskPriorityEnum>(query.Priority, true, out var priorityEnum))
            {
                queryable = queryable.Where(t => t.Priority == priorityEnum);
            }

            return queryable;
        }
    }
}
