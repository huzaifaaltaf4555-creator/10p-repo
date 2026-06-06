namespace TaskManager.API.Models
{
    /// <summary>
    /// Represents the current status of a task.
    /// </summary>
    public enum TaskStatusEnum
    {
        Pending = 0,
        InProgress = 1,
        Completed = 2
    }

    /// <summary>
    /// Represents the priority level of a task.
    /// </summary>
    public enum TaskPriorityEnum
    {
        Low = 0,
        Medium = 1,
        High = 2
    }
}
