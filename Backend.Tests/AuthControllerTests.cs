using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManager.API.Controllers;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;

namespace TaskManager.Tests
{
    /// <summary>
    /// Unit tests for the AuthController — endpoint-level tests.
    /// </summary>
    public class AuthControllerTests
    {
        private readonly Mock<IAuthService> _authServiceMock;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            _authServiceMock = new Mock<IAuthService>();
            _controller = new AuthController(_authServiceMock.Object);
        }

        [Fact]
        public async Task Register_ValidData_ReturnsOk()
        {
            // Arrange
            var dto = new RegisterDto
            {
                FullName = "Test User",
                Email = "test@example.com",
                Password = "Test@123",
                Role = "User"
            };

            var response = new AuthResponseDto
            {
                Token = "jwt-token",
                UserId = "user-1",
                FullName = "Test User",
                Email = "test@example.com",
                Role = "User"
            };

            _authServiceMock.Setup(x => x.RegisterAsync(dto))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.Register(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ReturnsBadRequest()
        {
            // Arrange
            var dto = new RegisterDto
            {
                FullName = "Test",
                Email = "dup@example.com",
                Password = "Test@123",
                Role = "User"
            };

            _authServiceMock.Setup(x => x.RegisterAsync(dto))
                .ThrowsAsync(new InvalidOperationException("A user with this email already exists."));

            // Act
            var result = await _controller.Register(dto);

            // Assert
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, badRequest.StatusCode);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            // Arrange
            var dto = new LoginDto { Email = "test@example.com", Password = "Test@123" };

            var response = new AuthResponseDto
            {
                Token = "jwt-token",
                UserId = "user-1",
                FullName = "Test User",
                Email = "test@example.com",
                Role = "User"
            };

            _authServiceMock.Setup(x => x.LoginAsync(dto))
                .ReturnsAsync(response);

            // Act
            var result = await _controller.Login(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            // Arrange
            var dto = new LoginDto { Email = "test@example.com", Password = "wrong" };

            _authServiceMock.Setup(x => x.LoginAsync(dto))
                .ThrowsAsync(new UnauthorizedAccessException("Invalid email or password."));

            // Act
            var result = await _controller.Login(dto);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(401, unauthorizedResult.StatusCode);
        }
    }
}
