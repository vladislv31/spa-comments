# NestJS Comments API

## Overview

This project is an API built with NestJS for a comment and reply system. Users can register, log in, post comments, reply to existing comments, and attach text files or images to comments.

## Features

- User registration and authentication
- JWT token-based authentication
- Comment posting
- Reply to existing comments
- Attach text files and images to comments


## Prerequisites

- Node.js v18.x or above
- Docker and Docker Compose
- A PostgreSQL database

## Quick Start

Clone the repository:

```
git clone https://github.com/your-repo/nestjs-comments-api.git
cd nestjs-comments-api
```

Rename .env.example to .env and update the environment variables.

Run the application using Docker Compose:

```
docker-compose up --build
```

The API should now be accessible at http://localhost:5000.