using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;

namespace TaskManager.API.Controllers
{
    /// <summary>
    /// Handles all task CRUD operations, filtering, search, and stats.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // Helper to get current user's ID from JWT claims
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        private bool IsAdmin() => User.IsInRole("Admin");

        /// <summary>
        /// Get tasks — admins see all, regular users see only their own.
        /// Supports search, filter by status/priority, and pagination.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetTasks([FromQuery] TaskQueryDto query)
        {
            PagedResult<TaskResponseDto> result;

            if (IsAdmin())
            {
                result = await _taskService.GetAllTasksAsync(query);
            }
            else
            {
                result = await _taskService.GetUserTasksAsync(GetUserId(), query);
            }

            return Ok(ApiResponse<PagedResult<TaskResponseDto>>.SuccessResponse(result));
        }

        /// <summary>
        /// Get current user's tasks only (even for admins, shows their own).
        /// </summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyTasks([FromQuery] TaskQueryDto query)
        {
            var result = await _taskService.GetUserTasksAsync(GetUserId(), query);
            return Ok(ApiResponse<PagedResult<TaskResponseDto>>.SuccessResponse(result));
        }

        /// <summary>
        /// Get task count statistics grouped by status.
        /// Admins see global stats, users see their own.
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = IsAdmin() ? null : GetUserId();
            var stats = await _taskService.GetStatsAsync(userId);
            return Ok(ApiResponse<TaskStatsDto>.SuccessResponse(stats));
        }

        /// <summary>
        /// Get a single task by ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound(ApiResponse<object>.ErrorResponse("Task not found."));

            // Regular users can only view their own tasks
            if (!IsAdmin() && task.AssignedUserId != GetUserId())
                return Forbid();

            return Ok(ApiResponse<TaskResponseDto>.SuccessResponse(task));
        }

        /// <summary>
        /// Create a new task assigned to the current user.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskCreateDto dto)
        {
            var task = await _taskService.CreateTaskAsync(dto, GetUserId());
            return CreatedAtAction(
                nameof(GetTaskById),
                new { id = task.Id },
                ApiResponse<TaskResponseDto>.SuccessResponse(task, "Task created successfully."));
        }

        /// <summary>
        /// Update an existing task.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskUpdateDto dto)
        {
            try
            {
                var task = await _taskService.UpdateTaskAsync(id, dto, GetUserId(), IsAdmin());
                if (task == null)
                    return NotFound(ApiResponse<object>.ErrorResponse("Task not found."));

                return Ok(ApiResponse<TaskResponseDto>.SuccessResponse(task, "Task updated successfully."));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        /// <summary>
        /// Delete a task by ID.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var result = await _taskService.DeleteTaskAsync(id, GetUserId(), IsAdmin());
                if (!result)
                    return NotFound(ApiResponse<object>.ErrorResponse("Task not found."));

                return Ok(ApiResponse<object>.SuccessResponse(new { }, "Task deleted successfully."));
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}
