using FluentValidation;
using TaskManager.API.DTOs;

namespace TaskManager.API.Validators
{
    /// <summary>
    /// Validates task creation input.
    /// </summary>
    public class TaskCreateValidator : AbstractValidator<TaskCreateDto>
    {
        public TaskCreateValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Task title is required.")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

            RuleFor(x => x.Category)
                .MaximumLength(100).WithMessage("Category cannot exceed 100 characters.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid task status.");

            RuleFor(x => x.Priority)
                .IsInEnum().WithMessage("Invalid task priority.");

            RuleFor(x => x.DueDate)
                .GreaterThanOrEqualTo(DateTime.UtcNow.Date)
                .When(x => x.DueDate.HasValue)
                .WithMessage("Due date cannot be in the past.");
        }
    }

    /// <summary>
    /// Validates task update input.
    /// </summary>
    public class TaskUpdateValidator : AbstractValidator<TaskUpdateDto>
    {
        public TaskUpdateValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Task title is required.")
                .MaximumLength(200).WithMessage("Title cannot exceed 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters.");

            RuleFor(x => x.Category)
                .MaximumLength(100).WithMessage("Category cannot exceed 100 characters.");

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid task status.");

            RuleFor(x => x.Priority)
                .IsInEnum().WithMessage("Invalid task priority.");
        }
    }
}
