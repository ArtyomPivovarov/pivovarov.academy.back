# Pivovarov Academy Backend

Backend API for Pivovarov Academy - an online learning platform built with NestJS and TypeScript.

> **Frontend Repository**: [pivovarov.academy.front](https://github.com/ArtyomPivovarov/pivovarov.academy.front)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database](#database)
- [Testing](#testing)
- [Docker](#docker)
- [Scripts](#scripts)
- [Related Projects](#related-projects)

## ✨ Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Email verification system
  - Role-based access control (RBAC)
  - Google OAuth integration

- **Learning Management**
  - Learning modules management
  - Lessons and video content
  - Student progress tracking
  - Subscription management

- **User Management**
  - User registration and authentication
  - Profile management
  - User roles (admin, instructor, student)

- **Subscription System**
  - Multiple subscription types
  - Subscription purchase and management
  - Access control based on subscriptions

- **Email Notifications**
  - Email verification
  - Transactional emails with Pug templates

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) 10.x
- **Runtime**: Node.js with TypeScript
- **Web Server**: [Fastify](https://www.fastify.io/)
- **Database**: PostgreSQL
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Email**: Nodemailer
- **Template Engine**: Pug
- **Package Manager**: pnpm

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v8 or higher)
- **PostgreSQL** (v14 or higher)
- **Docker & Docker Compose** (optional, for containerized deployment)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd pivovarov.academy.back
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Then configure your environment variables (see [Configuration](#configuration) section).

## ⚙️ Configuration

Configure the following environment variables in your `.env` file:

```env
# Application
PORT=4200
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=pivovarov_academy

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=noreply@pivovarov.academy

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## 🏃 Running the Application

### Development Mode

```bash
# Start with watch mode (recommended for development)
pnpm run start:dev

# Start with debug mode
pnpm run start:debug
```

### Production Mode

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start:prod
```

The API will be available at `http://localhost:4200/api`

## 📚 API Documentation

### Swagger/OpenAPI Specification

The API documentation is available in multiple formats:

- **OpenAPI JSON**: [`swagger.json`](./swagger.json) - Static OpenAPI 3.0 specification file
- **Interactive Swagger UI**: [http://localhost:4200/api](http://localhost:4200/api) (when app is running)

The Swagger documentation provides:
- Complete API endpoint reference
- Request/response schemas
- Authentication requirements
- Interactive API testing

### Swagger Configuration

The API documentation is automatically generated using `@nestjs/swagger`. The configuration is set up in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('pivovovarov.academy.back')
  .setVersion('0.0.2')
  .build()

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('api', app, document)
```

### Generating Full Swagger Documentation

To generate a complete `swagger.json` file with all endpoints:

1. **Start the application**

```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or manually (requires PostgreSQL running)
pnpm run start:dev
```

2. **Export Swagger documentation**

```bash
# In another terminal, export the swagger.json
pnpm run export:swagger
```

This will fetch the complete API documentation from the running application and save it to `swagger.json`.

### Authentication in Swagger

To test protected endpoints:

1. Navigate to [http://localhost:4200/api](http://localhost:4200/api)
2. Click the **Authorize** button (lock icon)
3. Enter your JWT token in the format: `Bearer <your_token>`
4. Click **Authorize** to apply the token to all requests

### API Base Path

All API endpoints are prefixed with `/api`:

- Base URL: `http://localhost:4200/api`
- Example: `http://localhost:4200/api/users`
- Swagger UI: `http://localhost:4200/api`
- Swagger JSON: `http://localhost:4200/api-json`

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Auth DTOs
│   ├── entities/           # Verification code entity
│   ├── guards/             # JWT & Local guards
│   └── strategies/         # Passport strategies
├── config/                  # Configuration files
├── learning-module/         # Learning modules CRUD
├── lesson/                  # Lessons management
├── lesson-progress/         # Student progress tracking
├── mail/                    # Email service
├── pagination/              # Pagination utilities
├── role/                    # Role-based access control
├── seeds/                   # Database seeders
├── subscription/            # Subscription management
├── templates/               # Email templates (Pug)
├── user/                    # User management
├── video/                   # Video content management
├── app.module.ts           # Root module
└── main.ts                 # Application entry point
```

## 🗄 Database

### Setup

1. **Create a PostgreSQL database**

```sql
CREATE DATABASE pivovarov_academy;
```

2. **Run migrations** (if available)

```bash
# TypeORM migrations will run automatically on application start
pnpm run start:dev
```

3. **Seed the database** (optional)

```bash
pnpm run seed
```

### Entity Relationship

The application includes the following main entities:

- **User**: User accounts and profiles
- **Role**: User roles (admin, instructor, student)
- **LearningModule**: Course modules
- **Lesson**: Individual lessons within modules
- **Video**: Video content for lessons
- **Subscription**: User subscriptions
- **SubscriptionType**: Available subscription plans
- **LessonProgress**: Student progress tracking
- **VerificationCode**: Email verification codes

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# Watch mode
pnpm run test:watch

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## 🐳 Docker

### Development with Docker Compose

```bash
# Start all services (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Build Docker Image

```bash
# Build the image
docker build -t pivovarov-academy-backend .

# Run the container
docker run -p 4200:4200 --env-file .env pivovarov-academy-backend
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `pnpm run start` | Start the application |
| `pnpm run start:dev` | Start in watch mode |
| `pnpm run start:debug` | Start in debug mode |
| `pnpm run start:prod` | Start in production mode |
| `pnpm run build` | Build the application |
| `pnpm run format` | Format code with Prettier |
| `pnpm run lint` | Lint and fix code with ESLint |
| `pnpm run test` | Run unit tests |
| `pnpm run test:watch` | Run tests in watch mode |
| `pnpm run test:cov` | Run tests with coverage |
| `pnpm run test:e2e` | Run E2E tests |
| `pnpm run seed` | Seed the database |
| `pnpm run export:swagger` | Export Swagger documentation to swagger.json |

## 🔗 Related Projects

- **Frontend Application**: [pivovarov.academy.front](https://github.com/ArtyomPivovarov/pivovarov.academy.front) - Nuxt 3 frontend with modern UI, video player, and subscription management

## 📄 License

This project is [UNLICENSED](LICENSE).
