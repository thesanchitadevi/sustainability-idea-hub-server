# Sustainability Idea Hub Server

## Project Description

The Sustainability Idea Hub is a platform designed to facilitate the sharing, evaluation, and development of sustainability-focused ideas across three key categories: Energy, Waste, and Transportation. This server provides the backend API for managing user accounts, idea submissions, voting, commenting, and administrative oversight of the platform.

The platform enables users to:

- Submit innovative sustainability ideas
- Attach images to illustrate concepts
- Vote on ideas (upvote/downvote)
- Comment and reply to discussions
- Filter and search through submitted ideas
- Track the review status of submissions

## Prerequisites

Before installation, ensure you have the following:

- Node.js (v16.x or higher)
- PostgreSQL database
- Cloudinary account (for image storage)
- npm or yarn package manager

## Installation Guide

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/sustainability-idea-hub-server.git
   cd sustainability-idea-hub-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

- Copy the example environment file to create your own
- Update the .env file with your credentials:
  - Database connection details
  - JWT secrets
  - Cloudinary credentials
  - Email configuration (if using password reset functionality)

4. **Database setup**
5. **Start the development server**

## Technologies Used

- **TypeScript**: Type-safe coding
- **Express.js**: Web server framework
- **Prisma**: Database ORM
- **PostgreSQL**: Database
- **JWT**: Authentication
- **Cloudinary**: Image storage and management
- **Multer**: File upload handling
- **Zod**: Request validation
- **Nodemailer**: Email sending (for password reset)
- **Bcrypt**: Password hashing

## API Endpoints

## API Endpoints

### Authentication

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/auth/login`           | User login                |
| POST   | `/api/auth/refresh-token`   | Refresh access token      |
| POST   | `/api/auth/change-password` | Change user password      |
| POST   | `/api/auth/forgot-password` | Request password reset    |
| POST   | `/api/auth/reset-password`  | Reset password with token |

### User Management

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| POST   | `/api/user/create-user` | Create a new user               |
| GET    | `/api/user`             | Get all users (admin only)      |
| PATCH  | `/api/user/:id/status`  | Update user status (admin only) |
| PATCH  | `/api/user/:id/role`    | Update user role (admin only)   |

### Ideas

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| POST   | `/api/idea`            | Create a new idea               |
| GET    | `/api/idea`            | Get all ideas with filtering    |
| GET    | `/api/idea/:id`        | Get a single idea by ID         |
| PATCH  | `/api/idea/:id`        | Update an idea                  |
| DELETE | `/api/idea/:id`        | Delete an idea                  |
| PATCH  | `/api/idea/:id/status` | Update idea status (admin only) |
| POST   | `/api/idea/:id/submit` | Submit idea for review          |

### Votes

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| POST   | `/api/vote/:ideaId` | Vote on an idea       |
| GET    | `/api/vote/:ideaId` | Get votes for an idea |

### Comments

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/api/comment/create`     | Add a comment                 |
| GET    | `/api/comment/:ideaId`    | Get comments for an idea      |
| DELETE | `/api/comment/:commentId` | Delete a comment (admin only) |

### Admin

| Method | Endpoint                         | Description                  |
| ------ | -------------------------------- | ---------------------------- |
| PATCH  | `/api/admin/idea/:id/rejectIdea` | Reject an idea with feedback |

## Database Schema

The application uses a relational database with the following primary models:

- Users
- Ideas
- Comments
- Votes
- IdeaImages
- Payments

Each idea belongs to a user and can have multiple images, comments, and votes.
