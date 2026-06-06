using TaskManager.API.Models;

namespace TaskManager.API.DTOs
{
    /// <summary>
    /// Data sent by client to create a new task.
    /// </summary>
    public class TaskCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Pending;
        public TaskPriorityEnum Priority { get; set; } = TaskPriorityEnum.Medium;
        public string Category { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
    }

    /// <summary>
    /// Data sent by client to update an existing task.
    /// </summary>
    public class TaskUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskStatusEnum Status { get; set; }
        public TaskPriorityEnum Priority { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
    }

    /// <summary>
    /// Task data returned to the client.
    /// </summary>
    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public string AssignedUserId { get; set; } = string.Empty;
        public string AssignedUserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// Task count stats grouped by status.
    /// </summary>
    public class TaskStatsDto
    {
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Pending { get; set; }
    }

    /// <summary>
    /// Query parameters for filtering and paginating tasks.
    /// </summary>
    public class TaskQueryDto
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
