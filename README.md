# Social Wall

A simple full-stack social wall application built with **Java, Spring Boot, PostgreSQL, HTML, CSS and JavaScript**.

The application allows users to create accounts, authenticate, publish posts with optional images, view the public wall and manage their personal wall.

The application also supports **English and Russian localization** for both the frontend and backend.

![Social Wall preview](screenshots/preview.png)

---

## Features

### Authentication

* User registration
* User login
* Session-based authentication
* User logout
* Password hashing with BCrypt
* Username and email uniqueness validation
* Request validation
* Authentication error handling
* Protected API endpoints

### Posts

* Create text posts
* Create image-only posts
* Create posts containing text and an image
* Maximum one image per post
* Supported image formats:

  * JPEG
  * PNG
  * GIF
  * WebP
* Maximum image size: **5 MB**
* Public wall with posts from all users
* Personal wall with posts created by the current user
* Display post author
* Display publication date
* Newest posts displayed first

### Frontend

* Registration page
* Login page
* Public wall
* Personal wall
* Post creation form
* Image upload
* Logout
* Basic responsive layout
* Client-side error handling
* English and Russian interface

The frontend intentionally uses plain **HTML, CSS and JavaScript** without a frontend framework.

### Localization

The application supports two languages:

* English
* Russian

Localization is implemented on both sides of the application:

* frontend interface text is stored in JSON translation files;
* backend validation and API messages are stored in Spring message bundles;
* the selected language is saved in the browser;
* browser language is used for initial language detection;
* backend responses are translated according to the request locale.

---

## Application Overview

The application consists of three main parts:

```text
┌───────────────────────────────┐
│          Frontend             │
│                               │
│  HTML + CSS + JavaScript      │
│  English / Russian            │
└───────────────┬───────────────┘
                │
                │ HTTP / REST API
                ▼
┌───────────────────────────────┐
│        Spring Boot            │
│                               │
│ Controller                    │
│      ↓                        │
│ Service                       │
│      ↓                        │
│ Repository                    │
└───────────────┬───────────────┘
                │
                │ JPA / Hibernate
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │
└───────────────────────────────┘
```

Uploaded images are stored in the local `uploads` directory and exposed by the application as static resources.

---

## Tech Stack

| Technology      | Purpose                          |
| --------------- | -------------------------------- |
| Java 21         | Backend programming language     |
| Spring Boot     | Application framework            |
| Spring MVC      | REST API and web layer           |
| Spring Security | Authentication and authorization |
| Spring Data JPA | Database access                  |
| Hibernate       | ORM                              |
| PostgreSQL      | Relational database              |
| Maven           | Build and dependency management  |
| HTML5           | Frontend structure               |
| CSS3            | Frontend styling                 |
| JavaScript      | Frontend logic                   |
| Docker Compose  | Local PostgreSQL environment     |
| JUnit           | Automated testing                |

---

## Project Structure

```text
social-wall/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/social_wall/
│   │   │       │
│   │   │       ├── config/
│   │   │       │   ├── LocaleConfig.java
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── WebConfig.java
│   │   │       │
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java
│   │   │       │   ├── GlobalExceptionHandler.java
│   │   │       │   └── PostController.java
│   │   │       │
│   │   │       ├── dto/
│   │   │       │   ├── LoginRequest.java
│   │   │       │   ├── PostResponse.java
│   │   │       │   └── RegisterRequest.java
│   │   │       │
│   │   │       ├── model/
│   │   │       │   ├── Post.java
│   │   │       │   └── User.java
│   │   │       │
│   │   │       ├── repository/
│   │   │       │   ├── PostRepository.java
│   │   │       │   └── UserRepository.java
│   │   │       │
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── CustomUserDetailsService.java
│   │   │       │   └── PostService.java
│   │   │       │
│   │   │       └── SocialWallApplication.java
│   │   │
│   │   └── resources/
│   │       │
│   │       ├── static/
│   │       │   ├── css/
│   │       │   │   └── style.css
│   │       │   ├── js/
│   │       │   │   ├── auth.js
│   │       │   │   ├── localization.js
│   │       │   │   └── posts.js
│   │       │   ├── locales/
│   │       │   │   ├── en.json
│   │       │   │   └── ru.json
│   │       │   ├── index.html
│   │       │   ├── login.html
│   │       │   ├── my-wall.html
│   │       │   └── register.html
│   │       │
│   │       ├── messages.properties
│   │       ├── messages_ru.properties
│   │       └── application.yaml
│   │
│   └── test/
│       ├── java/
│       │   └── com/example/social_wall/
│       │       ├── SocialWallApplicationTests.java
│       │       └── service/
│       │           └── PostServiceTest.java
│       │
│       └── resources/
│           └── application.yaml
│
├── screenshots/
│   └── preview.png
│
├── .env.example
├── .gitignore
├── .gitattributes
├── compose.yaml
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

---

## Architecture

The backend follows a layered architecture.

### Controller

Responsible for HTTP requests and responses.

```text
controller/
```

Examples:

* `AuthController`
* `PostController`
* `GlobalExceptionHandler`

### Service

Contains application and business logic.

```text
service/
```

Examples:

* user registration
* authentication
* post creation
* image validation
* image saving
* post retrieval

### Repository

Provides database access through Spring Data JPA.

```text
repository/
```

### Model

Contains JPA entities representing database tables.

```text
model/
```

Main entities:

* `User`
* `Post`

### DTO

Objects used for transferring data through the API.

```text
dto/
```

This prevents exposing database entities directly through the API.

### Configuration

Application configuration is located in:

```text
config/
```

Main configuration classes:

* `SecurityConfig` — authentication, authorization and sessions
* `LocaleConfig` — supported application locales
* `WebConfig` — web and static resource configuration

---

## Database

The application uses **PostgreSQL**.

PostgreSQL can be started locally using Docker Compose.

The project is configured to use:

```text
Host: localhost
Port: 5433
Database: postgresql
Username: postgres
```

The Docker container itself uses PostgreSQL's internal port:

```text
5432
```

The port mapping is:

```text
5433 → 5432
```

Database credentials are stored in a local `.env` file and are not committed to the repository.

A template is provided in:

```text
.env.example
```

---

## Running PostgreSQL

Make sure Docker Desktop is running.

Start PostgreSQL:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

Check PostgreSQL:

```bash
docker compose exec postgres pg_isready -U postgres -d postgresql
```

Stop the database:

```bash
docker compose down
```

---

## Requirements

Before running the application, install:

* Java 21
* Docker Desktop

Maven does not need to be installed separately because the project includes the Maven Wrapper.

Check Java:

```bash
java -version
```

Expected version:

```text
21.x
```

Check Docker:

```bash
docker --version
```

---

## Environment Configuration

Create a local `.env` file in the project root.

Example:

```env
POSTGRES_DB=postgresql
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password

DB_URL=jdbc:postgresql://localhost:5433/postgresql
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

The `.env` file is ignored by Git.

Do not commit real database credentials.

---

## Running the Application

### 1. Clone the repository

```bash
git clone https://github.com/YujinCIX/social-wall.git
cd social-wall
```

### 2. Configure environment variables

Create `.env` based on `.env.example`.

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run tests

On Linux/macOS:

```bash
./mvnw clean test
```

On Windows:

```powershell
.\mvnw.cmd clean test
```

### 5. Start Spring Boot

Linux/macOS:

```bash
./mvnw spring-boot:run
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### 6. Open the application

The application is available at:

```text
http://localhost:8080
```

---

## Main Pages

| Page             | Description   |
| ---------------- | ------------- |
| `/index.html`    | Public wall   |
| `/login.html`    | Login         |
| `/register.html` | Registration  |
| `/my-wall.html`  | Personal wall |

---

## Localization

The application supports:

* English
* Russian

### Frontend localization

Frontend translations are stored in:

```text
src/main/resources/static/locales/
```

Files:

```text
en.json
ru.json
```

The main localization logic is implemented in:

```text
src/main/resources/static/js/localization.js
```

The selected language is stored in the browser using `localStorage`.

The application first checks for a previously selected language. If none exists, the browser language is used when supported. English is used as the default language.

### Backend localization

Backend messages are stored in:

```text
src/main/resources/messages.properties
src/main/resources/messages_ru.properties
```

Spring uses the request `Accept-Language` header to determine the backend locale.

Supported locales are configured in:

```text
LocaleConfig.java
```

Backend messages include:

* validation errors;
* authentication messages;
* registration messages;
* post validation errors;
* image upload errors.

The frontend sends the selected locale with API requests, allowing backend error messages to match the selected interface language.

---

## REST API

### Authentication

#### Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "username": "john",
  "password": "password123"
}
```

The application creates an authenticated HTTP session after successful login.

### Logout

```http
POST /api/auth/logout
```

The current session is invalidated.

### Posts

#### Get public posts

```http
GET /api/posts
```

Returns posts from all users.

Posts are sorted by publication date in descending order.

#### Get current user's posts

```http
GET /api/posts/my
```

Requires authentication.

#### Create a post

```http
POST /api/posts
```

The endpoint accepts `multipart/form-data`.

Supported fields:

```text
content
image
```

A post must contain at least one of:

* text;
* image.

An image is optional.

Only one image can be attached to a post.

---

## Image Upload

The application validates uploaded images before saving them.

Allowed MIME types:

```text
image/jpeg
image/png
image/gif
image/webp
```

Maximum size:

```text
5 MB
```

Images receive generated UUID-based filenames instead of using the original filename.

Example:

```text
550e8400-e29b-41d4-a716-446655440000.jpg
```

This prevents filename collisions between uploaded files.

Uploaded files are stored in:

```text
uploads/
```

The directory is excluded from Git.

---

## Security

The application uses Spring Security for authentication.

Passwords are never stored as plain text.

Before saving a password, the application applies BCrypt hashing:

```text
Plain password
      ↓
BCrypt
      ↓
Password hash
      ↓
PostgreSQL
```

Authentication is maintained using an HTTP session.

Protected API endpoints require an authenticated session.

CSRF is disabled because the application uses a simple session-based REST API for this educational project.

---

## Validation

The application validates:

### Registration

* Username must contain 3–50 characters
* Email must have a valid format
* Password must contain 8–100 characters
* Username must be unique
* Email must be unique

### Posts

* A post must contain text or an image
* Image size cannot exceed 5 MB
* Image MIME type must be supported
* Image extension must be supported

---

## Testing

The project uses JUnit and Spring Boot testing.

Run all tests:

```bash
./mvnw clean test
```

Windows:

```powershell
.\mvnw.cmd clean test
```

The test suite includes:

* Spring application context test
* Post service tests

Current test suite:

```text
Tests run: 3
Failures: 0
Errors: 0
Skipped: 0

BUILD SUCCESS
```

The test database uses an isolated H2 in-memory database, so application tests do not require the local PostgreSQL database.

---

## Git Workflow

The project uses a feature-branch workflow.

```text
main
  │
  └── develop
        │
        ├── feature/auth
        │
        ├── feature/posts
        │
        ├── feature/frontend
        │
        └── feature/localization
```

### `main`

Contains stable versions of the project.

### `develop`

Integration branch containing completed development work before the stable release.

### `feature/auth`

Authentication implementation.

### `feature/posts`

Post functionality and related backend changes.

### `feature/frontend`

Frontend pages, JavaScript, CSS and frontend-related configuration.

### `feature/localization`

English and Russian localization for the frontend and backend.

---

## Commit Convention

The project uses descriptive commit prefixes.

| Prefix      | Purpose                  |
| ----------- | ------------------------ |
| `feat:`     | New functionality        |
| `fix:`      | Bug fix                  |
| `refactor:` | Code restructuring       |
| `test:`     | Tests                    |
| `docs:`     | Documentation            |
| `style:`    | Formatting/style changes |
| `chore:`    | Maintenance              |

Examples:

```text
feat: implement authentication
feat: implement posts
fix: resolve lazy loading for posts
feat: implement frontend
feat: add backend localization
feat: add frontend localization
fix: stabilize frontend localization
docs: update README with localization
```

---

## Development Progress

### Backend

* [x] Spring Boot application
* [x] PostgreSQL integration
* [x] JPA entities
* [x] User repository
* [x] Post repository
* [x] User registration
* [x] User login
* [x] User logout
* [x] BCrypt password hashing
* [x] Session authentication
* [x] Request validation
* [x] Exception handling
* [x] Post creation
* [x] Image upload
* [x] Image validation
* [x] Public posts
* [x] Personal posts
* [x] Author information
* [x] Publication date
* [x] Backend localization
* [x] English and Russian messages

### Frontend

* [x] Registration page
* [x] Login page
* [x] Public wall
* [x] Personal wall
* [x] Post creation form
* [x] Image upload
* [x] Logout
* [x] Error messages
* [x] Basic responsive styling
* [x] English interface
* [x] Russian interface
* [x] Language switching
* [x] Browser language detection
* [x] Persistent language selection

### Infrastructure

* [x] Maven Wrapper
* [x] Docker Compose
* [x] PostgreSQL container
* [x] Environment variables
* [x] `.gitignore`
* [x] `.gitattributes`
* [x] Git feature branches
* [x] Automated tests

---

## License

This project was created as an educational project.

---

## Author

**YujinCIX**

GitHub repository:

https://github.com/YujinCIX/social-wall
