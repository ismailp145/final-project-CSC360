# Project Requirements Implementation

## Describe each of the above requirements and how your project meets them

### 1. React Frontend with Bootstrap Styling

- Built with React + TypeScript for type safety and better development experience
- Leverages Bootstrap for responsive design and modern UI components
- Uses React Bootstrap components for consistent styling and layout
- Implements responsive design principles for all screen sizes
- Custom styling applied through Bootstrap classes and minimal custom CSS

### 2. .NET Minimal API Backend

- Implemented using .NET Core 8.0 Minimal API architecture
- Complete RESTful API implementation with all required HTTP methods:
  - GET: Retrieve posts, user data, and comments
  - POST: Create new posts, comments, and user accounts
  - PUT: Update existing posts and user preferences
  - DELETE: Remove posts and comments
- Swagger/OpenAPI documentation for API endpoints

### 3. Database Persistence

- PostgreSQL database for robust data storage
- Entity Framework Core for database operations
- Properly structured database schema with relationships
- Efficient data querying and indexing
- Secure data storage with proper constraints

### 4. Entity Framework Integration

- Entity Framework Core as the primary ORM
- Code-first approach with migrations
- Automatic database schema updates
- Efficient query optimization
- Proper relationship mapping between entities

### 5. Authentication System

- JWT-based authentication implementation
- Complete user account workflow:
  - User registration with email verification
  - Secure password hashing using BCrypt
  - Login with JWT token generation
  - Token refresh mechanism
- Protected routes and API endpoints
- Secure session management

### 6. Multi-page Application with State Management

- Multiple views using React Router:
  - Landing page
  - User profile
  - Post creation and viewing
  - Comment system
- State management using React Context API:
  - User authentication state
  - User preferences
  - Post and comment data
- Persistent user preferences storage
- Real-time updates for social interactions

## Why did you choose this specific project?

I chose this specici project beacuse I do not like the current social media platforms that exist today. Though they are near perfect in terms of design and usage, they are extremely time consuming, and profit off your data. I wanted to create a free, private social media platform with only one purpose: to connect you with your loved ones. That should be the focus of social media, not profits.

## If you had more time, what would you do differently?

I would allow you to follow friends. I would create a home page with only posts from people that you are friends with. That way, you would only see posts from people you follow and stay in touch with them. Add more social log ins and a forget password flow. I would also encrypt the posts so that users' data is safe and secure. I would also try to make this more accesible on mobile, since that is the easiest way for most people to communicate with eachother. 

# Project Setup Guide

## Overview
This project is a full-stack application built with:
- Frontend: React + TypeScript + Vite
- Backend: .NET Core API
- Database: PostgreSQL

## Prerequisites
- Node.js (v18 or higher)
- .NET SDK (v8.0 or higher)
- PostgreSQL (v15 or higher)
- Git
- A modern web browser

## Project Structure
```
├── frontend/           # React + TypeScript frontend
├── backend/           # .NET Core API backend
└── README.md         # Project documentation
```

## Setup Instructions

### Database Setup
1. Install PostgreSQL:
   - **macOS**: Use Homebrew: `brew install postgresql@15`
   - **Windows**: Download installer from [PostgreSQL website](https://www.postgresql.org/download/windows/)
   - **Linux**: Use package manager: `sudo apt-get install postgresql`

2. Start PostgreSQL service:
   - **macOS**: `brew services start postgresql@15`
   - **Windows**: PostgreSQL service starts automatically
   - **Linux**: `sudo service postgresql start`

3. Create database and user:
   ```bash
   # Connect to PostgreSQL
   psql postgres

   # Create database
   CREATE DATABASE socal_db;

   # Create user (replace with your desired username and password)
   CREATE USER socal_user WITH PASSWORD 'your_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE socal_db TO socal_user;
   ```

4. Update connection string in `backend/SocalAPI/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=socal_db;Username=socal_user;Password=your_password"
     }
   }
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/SocalAPI
   ```

2. Restore .NET dependencies:
   ```bash
   dotnet restore
   ```

3. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

4. Run the backend server:
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5263`

## Technical Components

### Frontend
- **React**: Modern UI library for building interactive user interfaces
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast build tool and development server
- **ESLint**: Code quality and style enforcement
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests

### Backend
- **.NET Core**: Cross-platform framework for building web APIs
- **Entity Framework Core**: Object-database mapper
- **PostgreSQL**: Relational database system
- **Npgsql**: PostgreSQL provider for Entity Framework Core
- **JWT Authentication**: Secure API authentication

### Database
- **PostgreSQL**: Advanced open-source relational database
- **pgAdmin**: Database management tool (optional)
- **Entity Framework Migrations**: Database version control

## Technical Requirements Implementation

1. Frontend Implementation
   - React application with TypeScript for type safety
   - Bootstrap components for responsive design
   - React Router for multiple page views
   - Context API for state management (AuthContext, user preferences)

2. Backend Implementation
   - .NET Minimal API with Entity Framework Core
   - Complete CRUD operations (GET, POST, PUT, DELETE)
   - JWT-based authentication
   - User registration and login workflows

3. Database Integration
   - Entity Framework Core for database operations
   - PostgreSQL database for data persistence
   - User and Posts tables with proper relationships
   - Secure password hashing and token storage

4. Authentication & Authorization
   - JWT token-based authentication
   - Protected API endpoints
   - User registration and login flows
   - Secure token storage and refresh mechanism

## Package Dependencies

### Frontend Packages (package.json)
```json
{
  "dependencies": {
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.61",
    "@types/react-dom": "^18.2.19",
    "axios": "^1.6.7",
    "bootstrap": "^5.3.3",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.2",
    "typescript": "^5.3.3"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.1.0",
    "@typescript-eslint/parser": "^7.1.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^5.1.4"
  }
}
```

### Backend Packages (.csproj)
```xml
<ItemGroup>
  <!-- Core Packages -->
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.2" />
  <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.2" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.2">
    <PrivateAssets>all</PrivateAssets>
    <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
  </PackageReference>
  
  <!-- Database -->
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.2" />
  
  <!-- Security -->
  <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
  
  <!-- Utilities -->
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
</ItemGroup>
```

### Backend Package Installation Commands
Run these commands from the `backend/SocalAPI` directory:

```bash
# Core Packages
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.2
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.2
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.2

# Database
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL --version 8.0.2

# Security
dotnet add package BCrypt.Net-Next --version 4.0.3

# Utilities
dotnet add package Swashbuckle.AspNetCore --version 6.5.0
```

## Getting Help
If you encounter any issues during setup:
1. Check the console for error messages
2. Review the documentation in the respective directories
3. Ensure all prerequisites are properly installed
4. Verify environment variables are correctly set
5. Check PostgreSQL service is running
6. Verify database connection string is correct

## Additional Setup Instructions

### Entity Framework Tools Installation
Before running the project, you need to install the Entity Framework Core tools globally:
```bash
dotnet tool install --global dotnet-ef
```

### Database Migrations
After setting up the database and before running the application, you need to apply the database migrations:
```bash
# Navigate to the backend directory
cd backend/SocalAPI

# Create the initial migration (if not already done)
dotnet ef migrations add InitialCreate

# Apply the migrations to create the database schema
dotnet ef database update
```

### Environment Variables
Create a `.env` file in the frontend directory with the following variables:
```env
VITE_API_URL=http://localhost:5263
```

### Additional Dependencies
The project uses several key frameworks and tools that need to be installed:

1. **Frontend Dependencies**
   - Node.js v18 or higher
   - npm (comes with Node.js)
   - All frontend dependencies will be installed with `npm install`

2. **Backend Dependencies**
   - .NET SDK 8.0 or higher
   - Entity Framework Core tools
   - PostgreSQL 15 or higher
   - All backend dependencies will be installed with `dotnet restore`

3. **Development Tools**
   - Git for version control
   - A code editor (VS Code recommended)
   - PostgreSQL client (pgAdmin or similar)

### Running the Application
The application requires both frontend and backend to be running simultaneously:

1. Start the backend server:
```bash
cd backend/SocalAPI
dotnet run
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

### Troubleshooting Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL service is running
   - Verify the connection string in `appsettings.json`
   - Check if the database user has proper permissions

2. **Migration Issues**
   - If migrations fail, try removing the existing database and recreating it
   - Ensure you're in the correct directory when running migration commands
   - Check if all required packages are installed

3. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Ensure all environment variables are set correctly
   - Check for any TypeScript compilation errors

4. **Backend Build Issues**
   - Clean the solution: `dotnet clean`
   - Restore packages: `dotnet restore`
   - Rebuild: `dotnet build`

### Important Notes
- The application uses JWT authentication - ensure the JWT secret is properly configured
- PostgreSQL must be running before starting the application
- Both frontend and backend servers must be running for the application to work
- The frontend runs on port 5173 and the backend on port 5263 by default
