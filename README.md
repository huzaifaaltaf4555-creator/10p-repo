# Task Management System

A full-stack production-ready Task Management System built with **ASP.NET Core 8** and **React.js**.

## Tech Stack

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core + SQL Server (LocalDB)
- ASP.NET Identity + JWT Authentication
- AutoMapper, FluentValidation, Serilog
- xUnit + Moq (16 unit tests)
- Swagger with JWT support

### Frontend
- React 19 + Vite
- React Router v7
- Axios with JWT interceptors
- Context API (AuthContext, ToastContext)
- Tailwind CSS 3

---

## Project Structure

```
10p-repo/
├── Backend/                    # ASP.NET Core Web API
│   ├── Controllers/            # AuthController, TasksController, UsersController
│   ├── Models/                 # ApplicationUser, TaskItem, Enums
│   ├── DTOs/                   # Auth, Task, User, Common DTOs
│   ├── Data/                   # AppDbContext, DbSeeder
│   ├── Interfaces/             # ITaskRepository, IAuthService, IJwtService, ITaskService
│   ├── Repositories/           # TaskRepository (EF Core)
│   ├── Services/               # AuthService, JwtService, TaskService
│   ├── Middleware/              # ExceptionMiddleware
│   ├── Validators/              # FluentValidation validators
│   ├── Mapping/                # AutoMapper profile
│   ├── Migrations/             # EF Core migrations
│   ├── Properties/             # launchSettings.json
│   ├── Program.cs              # App configuration
│   ├── appsettings.json        # Config (DB, JWT, Serilog)
│   └── TaskManager.API.csproj
│
├── Backend.Tests/              # xUnit test project
│   ├── AuthServiceTests.cs     # 5 tests
│   ├── TaskServiceTests.cs     # 7 tests
│   └── AuthControllerTests.cs  # 4 tests
│
├── Frontend/                   # React + Vite app
│   ├── src/
│   │   ├── app/                # App.jsx (router)
│   │   ├── components/         # Reusable components
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── layouts/            # AppShell
│   │   ├── pages/              # All page components
│   │   ├── services/           # API client + service layer
│   │   └── main.jsx            # Entry point
│   ├── .env                    # API base URL
│   └── package.json
│
├── TaskManager.sln             # Solution file
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- SQL Server LocalDB (included with Visual Studio)

### 1. Clone and checkout
```bash
git clone <repo-url>
cd 10p-repo
git checkout V2
```

### 2. Start the Backend
```bash
cd Backend
dotnet run
```

The API will start at **http://localhost:5000** and Swagger UI at http://localhost:5000/swagger.

On first run, the database is automatically:
- Created via EF Core migrations
- Seeded with roles (Admin, User)
- Seeded with default users and sample tasks

### 3. Start the Frontend
```bash
cd Frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

---

## Default Credentials

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@taskmanager.com  | Admin@123 |
| User  | user@taskmanager.com   | User@123  |

---

## API Endpoints

| Method | Endpoint            | Auth   | Description                        |
|--------|---------------------|--------|------------------------------------|
| POST   | /api/auth/register  | None   | Register new user                  |
| POST   | /api/auth/login     | None   | Login, returns JWT                 |
| GET    | /api/users/me       | Bearer | Get current user profile           |
| GET    | /api/tasks          | Bearer | Get tasks (paginated, filterable)  |
| GET    | /api/tasks/stats    | Bearer | Task count by status               |
| GET    | /api/tasks/my       | Bearer | Current user's tasks only          |
| GET    | /api/tasks/{id}     | Bearer | Get task by ID                     |
| POST   | /api/tasks          | Bearer | Create task                        |
| PUT    | /api/tasks/{id}     | Bearer | Update task                        |
| DELETE | /api/tasks/{id}     | Bearer | Delete task                        |

**Query params** for `GET /api/tasks`: `search`, `status`, `priority`, `page`, `pageSize`

---

## Running Tests

```bash
cd Backend.Tests
dotnet test
```

Expected: **16 passed, 0 failed**

---

## Application Screens

1. **Login Page** — Email/password with validation and error display
2. **Register Page** — Full name, email, password, role selection
3. **Dashboard** — Task stats (Completed/InProgress/Pending) + recent tasks
4. **Task List** — Search, filter by status/priority, pagination, delete
5. **Task Detail** — View task info, edit/delete actions
6. **Create/Edit Task** — Form with validation for create and update
7. **User Profile** — View profile info + logout
8. **Admin Dashboard** — Aggregate stats + all tasks (admin only)
9. **404 Page** — Not found with navigation back

---

## Key Features

- **JWT Authentication** with token stored in localStorage
- **Role-based access** — Admin sees all tasks, User sees only own
- **Protected routes** — Auto-redirect to login if not authenticated
- **Axios interceptors** — Auto-attach JWT token, auto-redirect on 401
- **Toast notifications** — Success/error feedback on all operations
- **Search & Filter** — Search by title/description, filter by status/priority
- **Pagination** — Server-side pagination with page controls
- **FluentValidation** — Server-side validation with proper error responses
- **Serilog logging** — Console + file logging (Logs/ directory)
- **Global exception handling** — Standardized error responses
- **Swagger UI** — Full API documentation with JWT support
- **Seed data** — Default users + sample tasks on first run

---

## Database

The app uses **SQL Server LocalDB** with EF Core Code First.

### Migration Commands
```bash
# Create a new migration
dotnet ef migrations add <MigrationName> --project Backend

# Apply migrations
dotnet ef database update --project Backend

# Remove last migration
dotnet ef migrations remove --project Backend
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TaskManagerDb;..."
  },
  "JwtSettings": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!2024",
    "Issuer": "TaskManagerAPI",
    "Audience": "TaskManagerClient",
    "ExpiryMinutes": 60
  }
}
```