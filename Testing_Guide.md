# Testing Guide

This document outlines the testing strategy and procedures used to ensure the reliability and security of the Task Management System.

## 1. Automated Backend Testing (Unit Tests)

The backend is fully tested using **xUnit** and **Moq** to isolate and verify business logic without requiring a live database connection. We have a dedicated `Backend.Tests` project containing 16 unit tests.

### How to run the automated tests:
1. Open a terminal and navigate to the tests folder:
   ```bash
   cd Backend.Tests
   ```
2. Execute the test runner:
   ```bash
   dotnet test
   ```
3. You should see an output indicating: **16 passed, 0 failed**.

### What we test:
- **AuthServiceTests**: Verifies successful registration, password hashing validation, duplicate email rejection, and proper JWT token generation upon login.
- **TaskServiceTests**: Verifies role-based access control (ensuring Users can only fetch/modify their own tasks, while Admins can access everything). Tests pagination, filtering, and CRUD operations.
- **AuthControllerTests**: Verifies that the API endpoints return the correct HTTP status codes (200 OK, 400 Bad Request, 401 Unauthorized) based on the service layer responses.

## 2. API Endpoint Testing (Swagger / Postman)

The backend includes a Swagger UI interface for manual API testing.
- **URL**: `http://localhost:5000/swagger`
- **Process**: 
  1. Call the `/api/auth/login` endpoint to receive a JWT token.
  2. Click the **Authorize** button at the top of Swagger and paste the token (`Bearer <your_token>`).
  3. Manually execute GET, POST, PUT, and DELETE requests on the `/api/tasks` endpoints to verify JSON payloads, pagination (`page`, `pageSize`), and filtering (`status`, `priority`).

## 3. Frontend End-to-End & Integration Testing (Manual)

The frontend React application was rigorously tested manually across various user flows.

### Authentication & Authorization Flow
- **Registration Edge Cases**: Tested form validation for empty fields, invalid emails, and strict password complexity (enforcing uppercase, lowercase, numbers, and symbols). Verified that the backend duplicate email error is parsed and displayed beautifully.
- **Login/Logout**: Verified that successful login redirects to the dashboard and saves the JWT to localStorage. Verified that logging out clears the session and redirects to the login screen.
- **Role-Based Routing**: Verified that a Regular User cannot access the Admin Dashboard, and attempting to navigate there via URL redirects them appropriately.

### Task Management Flow
- **CRUD Operations**: Created, updated, and deleted tasks. Verified that UI state updates immediately upon success.
- **Pagination & Filtering**: Tested the backend pagination integration by navigating between pages of tasks and applying multiple filters simultaneously (e.g., Status = InProgress + Priority = High).
- **Responsive Design**: Resized the browser window to ensure the AppShell, Sidebar, and Task Cards gracefully collapse on mobile and tablet devices using Tailwind CSS media queries.

## 4. Database Validation (SSMS)

To ensure data integrity, we connected to the SQL Server LocalDB via **SQL Server Management Studio (SSMS)**:
- Verified that Entity Framework Core generated the `AspNetUsers`, `AspNetRoles`, and `TaskItems` tables correctly.
- Confirmed that passwords are encrypted (hashed) in the database and never stored in plain text.
- Verified that Foreign Key constraints between `TaskItems.AssignedUserId` and `AspNetUsers.Id` were successfully established.
