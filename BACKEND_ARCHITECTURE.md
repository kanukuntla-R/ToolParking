# Tool Parking - Backend Architecture

## Overview

The backend has been properly separated from the frontend following industry best practices and security protocols.

## Architecture

```
src/
├── server/                    # Backend layer
│   ├── config/               # Configuration management
│   ├── controllers/          # Business logic & validation
│   ├── services/             # Data access layer
│   ├── middleware/           # Auth, rate limiting, security
│   └── validators/           # Input validation schemas
├── app/
│   └── api/                  # API routes (Next.js API)
│       ├── tools/
│       ├── projects/
│       └── stack/
├── lib/                      # Shared utilities (logger, types)
└── components/               # Frontend components
```

## Separation of Concerns

### 1. **Controllers** (`src/server/controllers/`)
- Handle business logic
- Validate input using validators
- Coordinate between services
- Return standardized responses

### 2. **Services** (`src/server/services/`)
- Database operations (CRUD)
- Data transformation
- Business rules enforcement
- Authorization checks

### 3. **Validators** (`src/server/validators/`)
- Input validation schemas
- Data type checking
- Business rule validation
- Error message generation

### 4. **Middleware** (`src/server/middleware/`)
- Authentication
- Rate limiting
- Security headers
- CORS handling

### 5. **API Routes** (`src/app/api/`)
- HTTP request/response handling
- Middleware application
- Error handling
- Response formatting

## Security Measures Implemented

### 1. **Authentication**
- Mock auth for development
- JWT-ready structure for production
- User ownership verification on all operations

### 2. **Authorization**
- Resource ownership checks
- User-scoped data access
- Prevents unauthorized modifications

### 3. **Input Validation**
- Tool creation/update validation
- Project creation/update validation
- Stack item validation
- Prevents injection attacks

### 4. **Rate Limiting**
- 100 requests per 15 minutes per IP
- Prevents abuse and DDoS
- In-memory store (Redis-ready for production)

### 5. **Security Headers**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: Restricted
- HSTS: Enabled in production

### 6. **Data Sanitization**
- String trimming on all text inputs
- URL validation
- Color format validation
- Category enum validation

## Current Status

### ✅ Completed
- Backend directory structure
- Configuration management
- Input validators
- Database service layer
- Controllers with validation
- Middleware (auth, rate limit, security)
- API routes for tools (GET, POST, PUT, DELETE)
- API routes for projects (GET, POST)
- Ownership verification
- Error handling
- Logging

### 🔄 In Progress
- Individual project API routes
- Stack item API routes
- Frontend integration with API routes

### 📋 TODO for Production
- Replace mock auth with real authentication (NextAuth, Clerk, etc.)
- Replace localStorage with real database (PostgreSQL, MongoDB)
- Implement proper JWT token verification
- Add Redis for rate limiting
- Add request logging/monitoring
- Add comprehensive error tracking
- Add database migrations
- Add backup/restore functionality
- Add comprehensive tests
- Add API documentation (Swagger/OpenAPI)
- Add environment-specific configurations
- Add CI/CD pipeline

## API Endpoints

### Tools
- `GET /api/tools` - List user's tools
- `POST /api/tools` - Create new tool
- `GET /api/tools/[id]` - Get tool by ID
- `PUT /api/tools/[id]` - Update tool
- `DELETE /api/tools/[id]` - Delete tool

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Stack Items
- `GET /api/stack?projectId=xxx` - List stack items
- `POST /api/stack` - Add tool to stack
- `PUT /api/stack/[id]` - Update stack item
- `DELETE /api/stack/[id]` - Remove from stack

## Response Format

All API responses follow a standardized format:

```typescript
// Success
{
  success: true,
  data: <response_data>
}

// Error
{
  success: false,
  error: "Error message"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation failed)
- `401` - Unauthorized
- `403` - Forbidden (ownership check failed)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Next Steps

1. **Complete API Routes**: Finish remaining endpoints (projects/[id], stack)
2. **Frontend Integration**: Update frontend to use API routes instead of direct service calls
3. **Testing**: Add unit and integration tests
4. **Production Database**: Migrate from localStorage to real database
5. **Authentication**: Implement real auth system
6. **Deployment**: Set up production environment

## Running the Application

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Environment Variables

Create `.env.local`:
```env
# Current (mock)
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=

# Future (production)
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
CORS_ORIGIN=https://yourdomain.com
```
