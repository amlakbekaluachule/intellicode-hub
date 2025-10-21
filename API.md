# IntelliCode Hub - API Documentation

This document describes the REST API endpoints for IntelliCode Hub.

## Base URL

- Development: `http://localhost:5000/api`
- Production: `https://api.intellicodehub.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "error": { ... }
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER",
      "createdAt": "2023-01-01T00:00:00Z"
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER"
    },
    "token": "jwt-token"
  }
}
```

#### GET /auth/me
Get current user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "VIEWER",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
```

### Projects

#### GET /projects
Get all projects for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-id",
      "name": "My Project",
      "description": "Project description",
      "isPublic": false,
      "ownerId": "user-id",
      "owner": {
        "id": "user-id",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "files": [
        {
          "id": "file-id",
          "name": "index.js",
          "path": "index.js",
          "language": "javascript",
          "size": 1024
        }
      ],
      "collaborators": [
        {
          "id": "collab-id",
          "user": {
            "id": "user-id",
            "name": "Jane Doe",
            "avatar": "https://example.com/avatar.jpg"
          },
          "role": "EDITOR"
        }
      ],
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /projects
Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "Project description",
  "isPublic": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-id",
    "name": "My New Project",
    "description": "Project description",
    "isPublic": false,
    "ownerId": "user-id",
    "owner": {
      "id": "user-id",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "files": [
      {
        "id": "file-id",
        "name": "README.md",
        "path": "README.md",
        "content": "# My New Project\n\nProject description",
        "language": "markdown",
        "size": 0
      }
    ],
    "collaborators": [],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### GET /projects/:id
Get a specific project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-id",
    "name": "My Project",
    "description": "Project description",
    "isPublic": false,
    "ownerId": "user-id",
    "owner": {
      "id": "user-id",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "files": [
      {
        "id": "file-id",
        "name": "index.js",
        "path": "index.js",
        "content": "console.log('Hello World');",
        "language": "javascript",
        "size": 32
      }
    ],
    "collaborators": [],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### PUT /projects/:id
Update a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "project-id",
    "name": "Updated Project Name",
    "description": "Updated description",
    "isPublic": true,
    "ownerId": "user-id",
    "owner": {
      "id": "user-id",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "files": [...],
    "collaborators": [],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

#### DELETE /projects/:id
Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### Project Files

#### GET /projects/:id/files
Get all files in a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "file-id",
      "name": "index.js",
      "path": "index.js",
      "content": "console.log('Hello World');",
      "language": "javascript",
      "size": 32,
      "isDirectory": false,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ]
}
```

#### PUT /projects/:id/files
Update a project file.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "path": "index.js",
  "content": "console.log('Updated content');"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file-id",
    "name": "index.js",
    "path": "index.js",
    "content": "console.log('Updated content');",
    "language": "javascript",
    "size": 35,
    "isDirectory": false,
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

#### POST /projects/:id/files
Create a new project file.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "path": "src/utils.js",
  "content": "export const helper = () => {};"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file-id",
    "name": "utils.js",
    "path": "src/utils.js",
    "content": "export const helper = () => {};",
    "language": "javascript",
    "size": 30,
    "isDirectory": false,
    "createdAt": "2023-01-01T12:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

#### DELETE /projects/:id/files
Delete a project file.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "path": "src/utils.js"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### AI Services

#### POST /ai/explain
Get AI explanation of code.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": "This is a recursive implementation of the Fibonacci sequence..."
  }
}
```

#### POST /ai/refactor
Get AI refactored code.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "function fibonacci(n) { return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2); }",
  "language": "javascript",
  "context": "Optimize for performance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "refactoredCode": "function fibonacci(n) {\n  if (n <= 1) return n;\n  \n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}"
  }
}
```

#### POST /ai/complete
Get AI code completions.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "code": "function calculateSum(",
  "language": "javascript",
  "position": { "line": 1, "column": 20 }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completions": [
      "numbers) { return numbers.reduce((sum, num) => sum + num, 0); }",
      "a, b) { return a + b; }",
      "arr) { return arr.reduce((acc, val) => acc + val, 0); }"
    ]
  }
}
```

#### POST /ai/suggest
Get AI suggestions for code.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "optimize",
  "code": "for (let i = 0; i < array.length; i++) { console.log(array[i]); }",
  "language": "javascript",
  "context": "Performance optimization"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "suggestion-id",
    "type": "optimize",
    "content": "array.forEach(item => console.log(item));",
    "suggestions": [],
    "metadata": {
      "model": "gpt-4",
      "tokens": 150,
      "timestamp": "2023-01-01T12:00:00Z"
    }
  }
}
```

### User Management

#### GET /users/profile
Get user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "role": "VIEWER",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
}
```

#### PUT /users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Smith",
      "avatar": "https://example.com/new-avatar.jpg",
      "role": "VIEWER",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T12:00:00Z"
    }
  }
}
```

#### GET /users/stats
Get user statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": 5,
    "collaborations": 12,
    "messages": 45,
    "files": 23,
    "totalFileSize": 1024000
  }
}
```

## WebSocket Events

### Connection
Connect to WebSocket server:
```
ws://localhost:5000
```

**Authentication:**
```json
{
  "token": "your-jwt-token"
}
```

### Events

#### join-project
Join a project room for real-time collaboration.

**Emit:**
```json
{
  "projectId": "project-id"
}
```

**Listen:**
- `collaborators-updated` - List of current collaborators
- `user-joined` - User joined the project
- `user-left` - User left the project

#### code-change
Broadcast code changes to other collaborators.

**Emit:**
```json
{
  "projectId": "project-id",
  "filePath": "src/index.js",
  "content": "console.log('Hello World');",
  "userId": "user-id"
}
```

**Listen:**
```json
{
  "filePath": "src/index.js",
  "content": "console.log('Hello World');",
  "userId": "user-id",
  "userName": "John Doe",
  "timestamp": "2023-01-01T12:00:00Z"
}
```

#### cursor-position
Broadcast cursor position to other collaborators.

**Emit:**
```json
{
  "projectId": "project-id",
  "filePath": "src/index.js",
  "position": { "line": 5, "column": 10 },
  "userId": "user-id"
}
```

**Listen:**
```json
{
  "userId": "user-id",
  "userName": "John Doe",
  "filePath": "src/index.js",
  "position": { "line": 5, "column": 10 },
  "timestamp": "2023-01-01T12:00:00Z"
}
```

#### chat-message
Send chat messages in a project.

**Emit:**
```json
{
  "projectId": "project-id",
  "message": "Hello everyone!"
}
```

**Listen:**
```json
{
  "id": "message-id",
  "userId": "user-id",
  "userName": "John Doe",
  "userAvatar": "https://example.com/avatar.jpg",
  "message": "Hello everyone!",
  "timestamp": "2023-01-01T12:00:00Z",
  "type": "MESSAGE"
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses include:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "details": [...]
  }
}
```

## Rate Limiting

API endpoints are rate limited:
- 100 requests per 15 minutes per IP
- AI endpoints: 10 requests per minute per user

## Pagination

List endpoints support pagination:
```
GET /projects?page=1&limit=10
```

Response includes:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Caching

AI responses are cached for 1 hour to improve performance and reduce costs.

## Webhooks

Webhook endpoints for external integrations:
- `POST /webhooks/github` - GitHub integration
- `POST /webhooks/slack` - Slack notifications
- `POST /webhooks/discord` - Discord notifications
