using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskManager.API.Models
{
    /// <summary>
    /// Represents a task in the system.
    /// </summary>
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Pending;

        public TaskPriorityEnum Priority { get; set; } = TaskPriorityEnum.Medium;

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        // Foreign key to ApplicationUser
        [Required]
        public string AssignedUserId { get; set; } = string.Empty;

        [ForeignKey(nameof(AssignedUserId))]
        public ApplicationUser? AssignedUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
