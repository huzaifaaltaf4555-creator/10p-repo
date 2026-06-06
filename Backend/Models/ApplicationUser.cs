using Microsoft.AspNetCore.Identity;

namespace TaskManager.API.Models
{
    /// <summary>
    /// Application user extending ASP.NET Identity.
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property — one user has many tasks
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
