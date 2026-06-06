using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Moq;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;
using TaskManager.API.Models;
using TaskManager.API.Services;

namespace TaskManager.Tests
{
    /// <summary>
    /// Unit tests for the AuthService — registration and login logic.
    /// </summary>
    public class AuthServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly Mock<IJwtService> _jwtServiceMock;
        private readonly Mock<ILogger<AuthService>> _loggerMock;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            // UserManager requires a store mock
            var store = new Mock<IUserStore<ApplicationUser>>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(
                store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

            _jwtServiceMock = new Mock<IJwtService>();
            _loggerMock = new Mock<ILogger<AuthService>>();

            _authService = new AuthService(
                _userManagerMock.Object,
                _jwtServiceMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task RegisterAsync_NewUser_ReturnsToken()
        {
            // Arrange
            var dto = new RegisterDto
            {
                FullName = "Test User",
                Email = "test@example.com",
                Password = "Test@123",
                Role = "User"
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(dto.Email))
                .ReturnsAsync((ApplicationUser?)null);

            _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), dto.Password))
                .ReturnsAsync(IdentityResult.Success);

            _userManagerMock.Setup(x => x.AddToRoleAsync(It.IsAny<ApplicationUser>(), "User"))
                .ReturnsAsync(IdentityResult.Success);

            _userManagerMock.Setup(x => x.GetRolesAsync(It.IsAny<ApplicationUser>()))
                .ReturnsAsync(new List<string> { "User" });

            _jwtServiceMock.Setup(x => x.GenerateToken(It.IsAny<ApplicationUser>(), It.IsAny<IList<string>>()))
                .Returns("mock-jwt-token");

            // Act
            var result = await _authService.RegisterAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("mock-jwt-token", result.Token);
            Assert.Equal("Test User", result.FullName);
            Assert.Equal("test@example.com", result.Email);
            Assert.Equal("User", result.Role);
        }

        [Fact]
        public async Task RegisterAsync_DuplicateEmail_ThrowsException()
        {
            // Arrange
            var dto = new RegisterDto
            {
                FullName = "Test User",
                Email = "existing@example.com",
                Password = "Test@123",
                Role = "User"
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(dto.Email))
                .ReturnsAsync(new ApplicationUser { Email = dto.Email });

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _authService.RegisterAsync(dto));
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var dto = new LoginDto { Email = "test@example.com", Password = "Test@123" };
            var user = new ApplicationUser
            {
                Id = "user-1",
                Email = dto.Email,
                FullName = "Test User"
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(dto.Email))
                .ReturnsAsync(user);

            _userManagerMock.Setup(x => x.CheckPasswordAsync(user, dto.Password))
                .ReturnsAsync(true);

            _userManagerMock.Setup(x => x.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "User" });

            _jwtServiceMock.Setup(x => x.GenerateToken(user, It.IsAny<IList<string>>()))
                .Returns("login-jwt-token");

            // Act
            var result = await _authService.LoginAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("login-jwt-token", result.Token);
            Assert.Equal("user-1", result.UserId);
        }

        [Fact]
        public async Task LoginAsync_WrongPassword_ThrowsUnauthorized()
        {
            // Arrange
            var dto = new LoginDto { Email = "test@example.com", Password = "wrong" };
            var user = new ApplicationUser { Email = dto.Email };

            _userManagerMock.Setup(x => x.FindByEmailAsync(dto.Email))
                .ReturnsAsync(user);

            _userManagerMock.Setup(x => x.CheckPasswordAsync(user, dto.Password))
                .ReturnsAsync(false);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _authService.LoginAsync(dto));
        }

        [Fact]
        public async Task LoginAsync_UserNotFound_ThrowsUnauthorized()
        {
            // Arrange
            var dto = new LoginDto { Email = "noone@example.com", Password = "any" };

            _userManagerMock.Setup(x => x.FindByEmailAsync(dto.Email))
                .ReturnsAsync((ApplicationUser?)null);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _authService.LoginAsync(dto));
        }
    }
}
