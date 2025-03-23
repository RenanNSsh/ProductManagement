# Product Management System

A full-stack web application for managing products and orders, built with Angular and .NET Core.

## Project Structure

The solution consists of two main parts:

### Frontend (Angular)
- Located in `productmanagement.client/`
- Built with Angular 19
- Uses NgRx for state management
- Implements SignalR for real-time updates
- Includes end-to-end testing with Cypress
- Follows BEM (Block Element Modifier) methodology for CSS class naming
  - Blocks: Independent components (e.g., `order-list`, `product-card`)
  - Elements: Parts of blocks (e.g., `order-list__title`, `product-card__price`)
  - Modifiers: Different states or variations (e.g., `order-list__item--completed`)

### Backend (.NET Core)
- Located in `ProductManagement.Server/`
- Built with .NET 9.0
- Follows Clean Architecture principles
- Uses Entity Framework Core for data access
- Implements SignalR for real-time communication

## Features

- Product Management
  - View product list
  - Create new products
  - Update product details
  - Delete products

- Order Management
  - View order list
  - Create new orders
  - Update order status
  - Real-time order updates via SignalR

- User Interface
  - Modern, responsive design
  - Loading states and error handling
  - Toast notifications
  - Form validation

## Prerequisites

- Node.js 20.x
- .NET 9.0 SDK
- SQL Server (or compatible database)
- Angular CLI 19.x

## Getting Started

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd ProductManagement.Server
   ```

2. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

3. Update the database:
   ```bash
   dotnet ef database update
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd productmanagement.client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: https://localhost:56554
- Backend API: https://localhost:7097
- Swagger UI: https://localhost:7097/swagger

## Testing

### Unit Tests

Run the Angular unit tests:
```bash
cd productmanagement.client
npm test
```

### End-to-End Tests

Run the Cypress E2E tests:
```bash
cd productmanagement.client
npm run cypress:open  # Opens Cypress Test Runner
npm run cypress:run   # Runs tests in headless mode
```

## Development

### Code Style

- Frontend follows Angular style guide
- Backend follows C# coding conventions
- ESLint and TypeScript strict mode enabled
  - Enforces consistent code style across the project
  - Includes rules for Angular best practices
  - Custom rules for import sorting and unused imports
  - Integrated with VS Code for real-time feedback
  - Configuration in `eslint.config.js`
- Prettier for code formatting
- CSS follows BEM methodology for maintainable and scalable styles
  - Example: `.order-list__item--completed { background-color: #e8f5e9; }`

### Project Structure

```
ProductManagement/
├── productmanagement.client/          # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/             # Feature modules
│   │   │   │   ├── order-list/       # Order list feature
│   │   │   │   ├── product-card/     # Product card feature
│   │   │   │   └── core/             # Core services
│   │   │   └── assets/                   # Static assets
│   │   └── cypress/                      # E2E tests
└── ProductManagement.Server/         # .NET backend
    ├── ProductManagement.API/        # API project
    ├── ProductManagement.Domain/     # Domain models
    ├── ProductManagement.Application/# Application logic
    └── ProductManagement.Persistence/# Data access
```

## Deployment

The application can be deployed using Docker:

```bash
docker build -t productmanagement -f ProductManagement.Server/ProductManagement.API/Dockerfile .
docker run -p 8080:8080 -p 8081:8081 productmanagement
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.