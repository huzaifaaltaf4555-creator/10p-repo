using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;
using TaskManager.API.Mapping;
using TaskManager.API.Models;
using TaskManager.API.Services;

namespace TaskManager.Tests
{
    /// <summary>
    /// Unit tests for the TaskService — CRUD + stats + authorization logic.
    /// </summary>
    public class TaskServiceTests
    {
        private readonly Mock<ITaskRepository> _repoMock;
        private readonly IMapper _mapper;
        private readonly Mock<ILogger<TaskService>> _loggerMock;
        private readonly TaskService _taskService;

        public TaskServiceTests()
        {
            _repoMock = new Mock<ITaskRepository>();
            _loggerMock = new Mock<ILogger<TaskService>>();

            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            _mapper = config.CreateMapper();

            _taskService = new TaskService(_repoMock.Object, _mapper, _loggerMock.Object);
        }

        [Fact]
        public async Task CreateTaskAsync_ShouldReturnCreatedTask()
        {
            // Arrange
            var dto = new TaskCreateDto
            {
                Title = "Test Task",
                Description = "Test Description",
                Status = TaskStatusEnum.Pending,
                Priority = TaskPriorityEnum.High,
                Category = "Dev"
            };

            var createdTask = new TaskItem
            {
                Id = 1,
                Title = "Test Task",
                Description = "Test Description",
                Status = TaskStatusEnum.Pending,
                Priority = TaskPriorityEnum.High,
                Category = "Dev",
                AssignedUserId = "user-1",
                AssignedUser = new ApplicationUser { FullName = "Test User" }
            };

            _repoMock.Setup(x => x.CreateAsync(It.IsAny<TaskItem>()))
                .ReturnsAsync(createdTask);

            // Act
            var result = await _taskService.CreateTaskAsync(dto, "user-1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Task", result.Title);
            Assert.Equal("Pending", result.Status);
            Assert.Equal("High", result.Priority);
        }

        [Fact]
        public async Task GetAllTasksAsync_ShouldReturnPagedResults()
        {
            // Arrange
            var query = new TaskQueryDto { Page = 1, PageSize = 10 };
            var tasks = new List<TaskItem>
            {
                new TaskItem
                {
                    Id = 1, Title = "Task 1", Status = TaskStatusEnum.Pending,
                    Priority = TaskPriorityEnum.Low, AssignedUserId = "u1",
                    AssignedUser = new ApplicationUser { FullName = "User One" }
                },
                new TaskItem
                {
                    Id = 2, Title = "Task 2", Status = TaskStatusEnum.Completed,
                    Priority = TaskPriorityEnum.High, AssignedUserId = "u2",
                    AssignedUser = new ApplicationUser { FullName = "User Two" }
                }
            };

            _repoMock.Setup(x => x.GetAllAsync(query))
                .ReturnsAsync(new PagedResult<TaskItem>
                {
                    Items = tasks, TotalCount = 2, Page = 1, PageSize = 10
                });

            // Act
            var result = await _taskService.GetAllTasksAsync(query);

            // Assert
            Assert.Equal(2, result.TotalCount);
            Assert.Equal(2, result.Items.Count);
            Assert.Equal("Task 1", result.Items[0].Title);
        }

        [Fact]
        public async Task DeleteTaskAsync_OwnTask_ShouldSucceed()
        {
            // Arrange
            var task = new TaskItem { Id = 1, AssignedUserId = "user-1" };

            _repoMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(task);
            _repoMock.Setup(x => x.DeleteAsync(1)).ReturnsAsync(true);

            // Act
            var result = await _taskService.DeleteTaskAsync(1, "user-1", false);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task DeleteTaskAsync_OtherUsersTask_ShouldThrow()
        {
            // Arrange
            var task = new TaskItem { Id = 1, AssignedUserId = "user-2" };

            _repoMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(task);

            // Act & Assert — regular user trying to delete another user's task
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _taskService.DeleteTaskAsync(1, "user-1", false));
        }

        [Fact]
        public async Task DeleteTaskAsync_AdminCanDeleteAnyTask()
        {
            // Arrange
            var task = new TaskItem { Id = 1, AssignedUserId = "user-2" };

            _repoMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(task);
            _repoMock.Setup(x => x.DeleteAsync(1)).ReturnsAsync(true);

            // Act — admin deleting another user's task
            var result = await _taskService.DeleteTaskAsync(1, "admin-1", true);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task GetStatsAsync_ShouldReturnCounts()
        {
            // Arrange
            var stats = new TaskStatsDto { Completed = 5, InProgress = 3, Pending = 2 };
            _repoMock.Setup(x => x.GetStatsAsync(null)).ReturnsAsync(stats);

            // Act
            var result = await _taskService.GetStatsAsync();

            // Assert
            Assert.Equal(5, result.Completed);
            Assert.Equal(3, result.InProgress);
            Assert.Equal(2, result.Pending);
        }

        [Fact]
        public async Task UpdateTaskAsync_OtherUsersTask_RegularUser_ShouldThrow()
        {
            // Arrange
            var existing = new TaskItem
            {
                Id = 1, Title = "Old", AssignedUserId = "user-2",
                AssignedUser = new ApplicationUser { FullName = "Other" }
            };
            var dto = new TaskUpdateDto { Title = "New" };

            _repoMock.Setup(x => x.GetByIdAsync(1)).ReturnsAsync(existing);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _taskService.UpdateTaskAsync(1, dto, "user-1", false));
        }
    }
}
