using AutoMapper;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;
using TaskManager.API.Models;

namespace TaskManager.API.Services
{
    /// <summary>
    /// Business logic layer for task operations.
    /// </summary>
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<TaskService> _logger;

        public TaskService(
            ITaskRepository taskRepository,
            IMapper mapper,
            ILogger<TaskService> logger)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Gets all tasks (admin use). Returns paginated results.
        /// </summary>
        public async Task<PagedResult<TaskResponseDto>> GetAllTasksAsync(TaskQueryDto query)
        {
            var result = await _taskRepository.GetAllAsync(query);

            return new PagedResult<TaskResponseDto>
            {
                Items = _mapper.Map<List<TaskResponseDto>>(result.Items),
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }

        /// <summary>
        /// Gets tasks for a specific user. Returns paginated results.
        /// </summary>
        public async Task<PagedResult<TaskResponseDto>> GetUserTasksAsync(string userId, TaskQueryDto query)
        {
            var result = await _taskRepository.GetByUserIdAsync(userId, query);

            return new PagedResult<TaskResponseDto>
            {
                Items = _mapper.Map<List<TaskResponseDto>>(result.Items),
                TotalCount = result.TotalCount,
                Page = result.Page,
                PageSize = result.PageSize
            };
        }

        /// <summary>
        /// Gets a single task by ID.
        /// </summary>
        public async Task<TaskResponseDto?> GetTaskByIdAsync(int id)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            return task == null ? null : _mapper.Map<TaskResponseDto>(task);
        }

        /// <summary>
        /// Creates a new task assigned to the specified user.
        /// </summary>
        public async Task<TaskResponseDto> CreateTaskAsync(TaskCreateDto dto, string userId)
        {
            var task = _mapper.Map<TaskItem>(dto);
            task.AssignedUserId = userId;
            task.CreatedAt = DateTime.UtcNow;
            task.UpdatedAt = DateTime.UtcNow;

            var created = await _taskRepository.CreateAsync(task);
            _logger.LogInformation("Task {TaskId} created by user {UserId}", created.Id, userId);

            return _mapper.Map<TaskResponseDto>(created);
        }

        /// <summary>
        /// Updates an existing task. Admins can update any task, users only their own.
        /// </summary>
        public async Task<TaskResponseDto?> UpdateTaskAsync(int id, TaskUpdateDto dto, string userId, bool isAdmin)
        {
            var existing = await _taskRepository.GetByIdAsync(id);
            if (existing == null) return null;

            // Check ownership (admin can update any task)
            if (!isAdmin && existing.AssignedUserId != userId)
            {
                _logger.LogWarning("User {UserId} attempted to update task {TaskId} owned by {OwnerId}",
                    userId, id, existing.AssignedUserId);
                throw new UnauthorizedAccessException("You can only update your own tasks.");
            }

            // Map updated fields
            _mapper.Map(dto, existing);
            existing.UpdatedAt = DateTime.UtcNow;

            var updated = await _taskRepository.UpdateAsync(existing);
            _logger.LogInformation("Task {TaskId} updated by user {UserId}", id, userId);

            return updated == null ? null : _mapper.Map<TaskResponseDto>(updated);
        }

        /// <summary>
        /// Deletes a task. Admins can delete any task, users only their own.
        /// </summary>
        public async Task<bool> DeleteTaskAsync(int id, string userId, bool isAdmin)
        {
            var existing = await _taskRepository.GetByIdAsync(id);
            if (existing == null) return false;

            // Check ownership
            if (!isAdmin && existing.AssignedUserId != userId)
            {
                _logger.LogWarning("User {UserId} attempted to delete task {TaskId} owned by {OwnerId}",
                    userId, id, existing.AssignedUserId);
                throw new UnauthorizedAccessException("You can only delete your own tasks.");
            }

            var result = await _taskRepository.DeleteAsync(id);
            if (result)
            {
                _logger.LogInformation("Task {TaskId} deleted by user {UserId}", id, userId);
            }

            return result;
        }

        /// <summary>
        /// Gets task statistics. Pass userId to scope to a single user.
        /// </summary>
        public async Task<TaskStatsDto> GetStatsAsync(string? userId = null)
        {
            return await _taskRepository.GetStatsAsync(userId);
        }
    }
}
