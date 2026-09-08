# 🎓 LearnScroll – Learning Management System

Full-stack Learning Management System with **role-based access for students, mentors, and administrators**.

LearnHub provides a structured learning platform where students can enroll in courses, complete lessons, attempt quizzes, track their learning progress, and earn certificates. Mentors can manage courses and learning content, while administrators manage users, courses, and platform resources.

Built as an **individual full-stack project** to explore backend development, REST APIs, authentication, role-based authorization, database management, testing, containerization, and CI workflows.

## 🛠️ Technology

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-REST_API-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-Orchestration-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge\&logo=jest\&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-API_Testing-000000?style=for-the-badge)
![ESLint](https://img.shields.io/badge/ESLint-Code_Quality-4B32C3?style=for-the-badge\&logo=eslint\&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-Code_Formatting-F7B93E?style=for-the-badge\&logo=prettier\&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?style=for-the-badge\&logo=githubactions\&logoColor=white)

## 📸 Screenshots

### 🌐 Landing Page
<img width="1897" height="906" alt="Screenshot 2026-09-08 231805" src="https://github.com/user-attachments/assets/172b0137-6aef-4968-bd98-ea7303124eb1" />



## ✨ Features

* 🔐 JWT-based authentication
* 👥 Role-based access control for **Student / Mentor / Admin**
* 📝 User registration and login
* 🔑 Secure password hashing
* 📚 Course browsing and enrollment
* 🎬 Structured lesson-based learning
* 🔒 Lesson progression and content unlocking
* 📝 Quiz and assessment system
* 🏆 Certificate generation after course completion
* 📊 Student learning progress tracking
* 👨‍🏫 Mentor dashboard
* 📚 Course and lesson management
* 📝 Quiz management
* 👤 User profile management
* 🛠️ Admin dashboard
* 👥 User and role management
* 📈 Course and student progress monitoring
* 🔗 RESTful API architecture
* 🐬 MySQL database integration
* 🐳 Dockerized backend
* ⚙️ Docker Compose environment
* 🧪 Automated API testing with Jest and Supertest
* 🧹 ESLint for code quality
* ✨ Prettier for consistent code formatting
* 🔄 GitHub Actions CI workflow

## 👥 User Roles

### 🎓 Student

Students can:

* Register and log in
* Browse available courses
* Enroll in courses
* Access course lessons
* Follow structured learning paths
* Complete lessons
* Attempt quizzes
* Track course progress
* Earn certificates
* Manage their profile

### 👨‍🏫 Mentor

Mentors can:

* Log in through the mentor portal
* Create and manage courses
* Add and manage lessons
* Create and manage quizzes
* Organize learning content
* Monitor student progress

### 🛠️ Admin

Administrators can:

* Manage users
* Manage student and mentor accounts
* Manage roles and permissions
* Manage courses
* Monitor platform activity
* Access administrative dashboards

## 🔄 How It Works

LearnHub combines **secure authentication, role-based authorization, structured learning paths, quizzes, certificates, and progress tracking** into a single learning platform.

### 🔐 1. Register / Log In

Users register and authenticate through the application. JWT-based authentication is used to securely identify users and protect restricted resources.

⬇️

### 📚 2. Browse & Enroll

Students browse available courses and enroll in courses they want to learn.

⬇️

### 🎬 3. Learn

Students progress through structured lessons and learning materials.

⬇️

### 🔓 4. Unlock

Lessons and learning activities follow a structured progression, ensuring students complete the required content before moving forward.

⬇️

### 📝 5. Take Quizzes

Students attempt quizzes associated with their learning content to evaluate their understanding.

⬇️

### 🏆 6. Earn Certificates

After completing the required course activities, students can receive a course completion certificate.

⬇️

### 📊 7. Track Progress

Students can monitor their learning progress through their dashboard.

⬇️

### 👨‍🏫 8. Manage

Mentors manage courses, lessons, and quizzes, while administrators manage users, roles, and platform resources.

### 🚀 Workflow

**🔐 Register/Login → 📚 Enroll → 🎬 Learn → 🔓 Unlock → 📝 Quiz → 🏆 Certificate → 📊 Track Progress**

## 🏗️ System Architecture

```text
┌──────────────────────────┐
│      React Frontend      │
│                          │
│ Student / Mentor / Admin │
└────────────┬─────────────┘
             │
             │ HTTP / REST API
             ▼
┌──────────────────────────┐
│     Node.js + Express    │
│                          │
│ Authentication           │
│ Authorization            │
│ Business Logic           │
│ REST API                 │
└────────────┬─────────────┘
             │
             │ Database Connection
             ▼
┌──────────────────────────┐
│          MySQL           │
│                          │
│ Users                    │
│ Courses                  │
│ Lessons                  │
│ Quizzes                  │
│ Enrollments              │
│ Progress                 │
│ Certificates             │
└──────────────────────────┘
```

## 🛠️ Tech Stack

### 🎨 Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)

* React
* React Router
* JavaScript
* Responsive UI
* Component-based architecture

### ⚙️ Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)

* Node.js
* Express.js
* RESTful APIs
* Authentication and authorization
* Role-based access control
* Middleware-based request handling

### 🗄️ Database & Security

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)

* MySQL
* JWT authentication
* Password hashing
* Protected API routes
* Role-based authorization

### 🐳 DevOps & Development

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge\&logo=githubactions\&logoColor=white)

* Docker
* Docker Compose
* Environment variables
* GitHub Actions CI

### 🧪 Testing & Code Quality

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge\&logo=jest\&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-API_Testing-000000?style=for-the-badge)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge\&logo=eslint\&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge\&logo=prettier\&logoColor=black)

* Jest
* Supertest
* ESLint
* Prettier

## 🚀 Run Locally

### 🧰 Prerequisites

* 🟢 **Node.js 18+**
* 📦 **npm**
* 🐬 **MySQL**
* 🐳 **Docker**
* 🐳 **Docker Compose**
* 🔧 **Git**

## 1️⃣ 📥 Clone the Repository

```bash
git clone https://github.com/gagan232005/Learning-Management-System.git
cd Learning-Management-System
```

## 2️⃣ ⚙️ Environment Variables

Create the required `.env` files based on the environment configuration used by the project.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

> 🔒 Never commit `.env` files or expose database credentials and JWT secrets in the repository.

## 3️⃣ 🐳 Run Backend with Docker

Build and start the backend using Docker Compose:

```bash
docker compose up --build
```

To run the containers in the background:

```bash
docker compose up -d --build
```

To stop the containers:

```bash
docker compose down
```

The backend API will be available at:

```text
http://localhost:5000
```

## 4️⃣ 🎨 Run Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

> 💡 **Note:** The backend and frontend can be run in separate environments. Make sure the backend API is running before using features that require server communication.

## 🧪 Testing

Run the automated test suite with:

```bash
npm test
```

API endpoints can be tested using Jest and Supertest.

Tests can cover important backend functionality such as:

* Authentication
* Authorization
* User management
* Course APIs
* Lesson APIs
* Quiz APIs
* Protected routes

## 🧹 Code Quality

Run ESLint to identify code-quality issues:

```bash
npm run lint
```

Format the code using Prettier:

```bash
npm run format
```

These tools help maintain consistent, readable, and maintainable code across the project.

## 🔄 Continuous Integration

LearnHub uses **GitHub Actions** to automate the development workflow.

The CI pipeline can be used to:

* Install dependencies
* Run linting
* Run automated tests
* Validate backend changes
* Ensure code changes meet project checks

This helps identify issues early and maintain code quality throughout development.

## 🔒 Security

The application follows several security practices:

* 🔐 JWT-based authentication
* 🔑 Password hashing
* 👥 Role-based authorization
* 🛡️ Protected backend routes
* 🌐 Environment-based configuration
* 🚫 Sensitive credentials excluded from source control

## 🗺️ Roadmap

* 📊 **Advanced Learning Analytics** — Provide deeper insights into student performance and course completion.
* 🔔 **Notifications** — Add notifications for new courses, quizzes, certificates, and learning milestones.
* 📧 **Email Integration** — Implement email verification and password-reset functionality.
* 🎯 **Personalized Learning** — Recommend courses based on student interests and learning history.
* 💬 **Discussion System** — Allow students and mentors to communicate through course discussions.
* 📱 **Mobile Optimization** — Improve the learning experience across mobile and tablet devices.
* ☁️ **Production Deployment** — Deploy the complete application using a production-ready cloud architecture.

> 🚀 **LearnHub is continuously evolving into a scalable learning platform focused on structured education, student engagement, and practical full-stack development.**

## 👨‍💻 Author

Built and maintained with ❤️ by **Gagan V**

🎓 Computer Science Engineering Student

🔗 **LinkedIn:** [Gagan V](https://www.linkedin.com/in/gagan232005/)

🔗 **GitHub:** [Gagan](https://github.com/gagan232005/)

---

> 💡 **LearnHub is an individual project built to explore full-stack development, REST API design, role-based access control, authentication, database management, testing, containerization, and CI/CD practices while building a practical Learning Management System.**
