using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Interfaces
{
    /// <summary>
    /// Service interface for authentication operations.
    /// </summary>
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }

    /// <summary>
    /// Service interface for JWT token generation.
    /// </summary>
    public interface IJwtService
    {
        string GenerateToken(ApplicationUser user, IList<string> roles);
    }

    /// <summary>
    /// Service interface for task business logic.
    /// </summary>
    public interface ITaskService
    {
        Task<PagedResult<TaskResponseDto>> GetAllTasksAsync(TaskQueryDto query);
        Task<PagedResult<TaskResponseDto>> GetUserTasksAsync(string userId, TaskQueryDto query);
        Task<TaskResponseDto?> GetTaskByIdAsync(int id);
        Task<TaskResponseDto> CreateTaskAsync(TaskCreateDto dto, string userId);
        Task<TaskResponseDto?> UpdateTaskAsync(int id, TaskUpdateDto dto, string userId, bool isAdmin);
        Task<bool> DeleteTaskAsync(int id, string userId, bool isAdmin);
        Task<TaskStatsDto> GetStatsAsync(string? userId = null);
    }
}
