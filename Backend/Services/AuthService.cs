using Microsoft.AspNetCore.Identity;
using TaskManager.API.DTOs;
using TaskManager.API.Interfaces;
using TaskManager.API.Models;

namespace TaskManager.API.Services
{
    /// <summary>
    /// Handles user registration and login using ASP.NET Identity.
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            IJwtService jwtService,
            ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _jwtService = jwtService;
            _logger = logger;
        }

        /// <summary>
        /// Registers a new user and returns a JWT token.
        /// </summary>
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Check if user already exists
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                _logger.LogWarning("Registration failed: email {Email} already exists", dto.Email);
                throw new InvalidOperationException("A user with this email already exists.");
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                _logger.LogWarning("Registration failed for {Email}: {Errors}", dto.Email, string.Join(", ", errors));
                throw new InvalidOperationException(string.Join(" ", errors));
            }

            // Assign role
            var role = dto.Role == "Admin" ? "Admin" : "User";
            await _userManager.AddToRoleAsync(user, role);

            // Generate JWT token
            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user, roles);

            _logger.LogInformation("User {Email} registered successfully with role {Role}", dto.Email, role);

            return new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Role = role
            };
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                _logger.LogWarning("Login failed: user {Email} not found", dto.Email);
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            var isValidPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isValidPassword)
            {
                _logger.LogWarning("Login failed: wrong password for {Email}", dto.Email);
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtService.GenerateToken(user, roles);

            _logger.LogInformation("User {Email} logged in successfully", dto.Email);

            return new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                Role = roles.FirstOrDefault() ?? "User"
            };
        }
    }
}
