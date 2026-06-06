using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Interfaces
{
    /// <summary>
    /// Repository interface for task data access operations.
    /// </summary>
    public interface ITaskRepository
    {
        Task<PagedResult<TaskItem>> GetAllAsync(TaskQueryDto query);
        Task<PagedResult<TaskItem>> GetByUserIdAsync(string userId, TaskQueryDto query);
        Task<TaskItem?> GetByIdAsync(int id);
        Task<TaskItem> CreateAsync(TaskItem task);
        Task<TaskItem?> UpdateAsync(TaskItem task);
        Task<bool> DeleteAsync(int id);
        Task<TaskStatsDto> GetStatsAsync(string? userId = null);
    }
}
