using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using TaskManager.API.Data;
using TaskManager.API.Interfaces;
using TaskManager.API.Mapping;
using TaskManager.API.Middleware;
using TaskManager.API.Models;
using TaskManager.API.Repositories;
using TaskManager.API.Services;
using TaskManager.API.Validators;

// ──────────────────────────────────────────────
// 1. Configure Serilog early (before builder)
// ──────────────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

try
{
    Log.Information("Starting Task Manager API");

    var builder = WebApplication.CreateBuilder(args);
    builder.Host.UseSerilog(); // Replace default logging with Serilog

    // ──────────────────────────────────────────────
    // 2. Database — EF Core + SQL Server
    // ──────────────────────────────────────────────
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    // ──────────────────────────────────────────────
    // 3. ASP.NET Identity
    // ──────────────────────────────────────────────
    builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
        options.Password.RequiredLength = 6;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

    // ──────────────────────────────────────────────
    // 4. JWT Authentication
    // ──────────────────────────────────────────────
    var jwtSettings = builder.Configuration.GetSection("JwtSettings");
    var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

    // ──────────────────────────────────────────────
    // 5. Dependency Injection — Services & Repos
    // ──────────────────────────────────────────────
    builder.Services.AddScoped<ITaskRepository, TaskRepository>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IJwtService, JwtService>();
    builder.Services.AddScoped<ITaskService, TaskService>();

    // ──────────────────────────────────────────────
    // 6. AutoMapper
    // ──────────────────────────────────────────────
    builder.Services.AddAutoMapper(typeof(MappingProfile));

    // ──────────────────────────────────────────────
    // 7. FluentValidation
    // ──────────────────────────────────────────────
    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<RegisterValidator>();

    // ──────────────────────────────────────────────
    // 8. Controllers + JSON options
    // ──────────────────────────────────────────────
    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy =
                System.Text.Json.JsonNamingPolicy.CamelCase;
        });

    // ──────────────────────────────────────────────
    // 9. CORS — Allow React frontend
    // ──────────────────────────────────────────────
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",   // Vite dev server
                    "http://localhost:5174",   // Alternate Vite dev server
                    "http://localhost:3000"     // Alternative port
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    // ──────────────────────────────────────────────
    // 10. Swagger with JWT support
    // ──────────────────────────────────────────────
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Task Manager API",
            Version = "v1",
            Description = "A production-ready Task Management System API"
        });

        // Add JWT auth to Swagger UI
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter your JWT token"
        });

        options.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    // ──────────────────────────────────────────────
    // Build the app
    // ──────────────────────────────────────────────
    var app = builder.Build();

    // ──────────────────────────────────────────────
    // Middleware pipeline
    // ──────────────────────────────────────────────
    app.UseMiddleware<ExceptionMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors("AllowFrontend");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    // ──────────────────────────────────────────────
    // Seed database on startup
    // ──────────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<AppDbContext>();

        // Apply any pending migrations
        await context.Database.MigrateAsync();

        // Seed roles, users, and sample data
        await DbSeeder.SeedAsync(services);
    }

    Log.Information("Task Manager API is running");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application failed to start");
}
finally
{
    Log.CloseAndFlush();
}
