# Social Wall

A simple social wall web application built with Java, Spring Boot, PostgreSQL, HTML, CSS and JavaScript.

## About

Social Wall is a simple web application where users can:

* create an account;
* log in to their account;
* create posts;
* attach one photo to a post;
* view posts created by other users;
* view their own posts.

## Technologies

* Java 21
* Maven
* Spring Boot
* Spring Data JPA
* Spring Security
* PostgreSQL
* HTML
* CSS
* JavaScript

## Project Structure

The application is organized into separate layers:

* `model` — database entities
* `repository` — database access
* `service` — business logic
* `controller` — REST API endpoints
* `dto` — API request and response objects
* `config` — application configuration

## Current Status

### Authentication

* [x] User entity
* [x] User repository
* [x] User registration
* [x] Request validation
* [x] Duplicate username/email validation
* [x] BCrypt password hashing
* [x] User login
* [x] Session-based authentication
* [x] User logout
* [x] Protected endpoints
* [x] Authentication error handling
* [x] Authentication tests

### Posts

* [ ] Create text posts
* [ ] Attach one photo to a post
* [ ] Public wall
* [ ] Personal wall
* [ ] Display post author
* [ ] Display publication date

### Frontend

* [ ] Registration page
* [ ] Login page
* [ ] Public wall
* [ ] Personal wall
* [ ] Basic styling

## Database

The project uses PostgreSQL.

For local development, PostgreSQL runs through Docker Compose.

The application connects to PostgreSQL using environment-specific configuration.

## Development

Build and run tests:

```bash
./mvnw clean test
```

On Windows:

```powershell
.\mvnw.cmd clean test
```

Run the application:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

## Git Workflow

The project uses the following branch structure:

```text
main
  │
  └── develop
        │
        ├── feature/auth
        ├── feature/posts
        └── feature/frontend
```

`main` contains stable versions.

`develop` is used for integration.

Feature branches are used for individual parts of the application.

## Project Status

The project is currently under development.
