## Table of Contents

- [About](#about)
- [Folder Structure](#folder-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Folders](#project-folders)
- [Docker Support](#docker-support)

---

## About

My React project.

---

## Folder Structure

```
my-react-app/
├── node_modules/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── api/
│   │   ├── AnalyticsApi.js
│   │   ├── AuthApi.js
│   │   ├── NotificationsApi.js
│   │   ├── RoleApi.js
│   │   ├── TaskApi.js
│   │   └── UserApi.js
│   ├── common/
│   │   ├── Debounce.jsx
│   │   ├── Loading.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.js
│   │   ├── RegisterModal.jsx
│   │   ├── Tooltip.jsx
│   │   └── Topbar.js
│   ├── components/
│   │   ├── AdminRoute.js
│   │   ├── AllTaskListing.jsx
│   │   ├── ConfirnationPage.jsx
│   │   ├── CreatedTaskListing.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ForgotPwd.jsx
│   │   ├── LoginForm.jsx
│   │   ├── Logout.jsx
│   │   ├── MyTaskListing.jsx
│   │   ├── PrivateRoute.js
│   │   ├── PusherListener.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ResetPwd.jsx
│   │   ├── SendMessages.jsx
│   │   ├── SidebarData.js
│   │   ├── UserActivity.jsx
│   │   └── UserListing.jsx
│   ├── pages/
│   │   └── LoginPage.jsx
│   ├── redux/
│   │   ├── authReducer.js
│   │   ├── store.js
│   │   ├── userReducer.js
│   │   └── verifyAdmin.js
│   ├── style/
│   │   ├── Dashboard.css
│   │   ├── LoginForm.css
│   │   ├── Navbar.css
│   │   ├── RegisterForm.css
│   │   ├── RegisterModal.css
│   │   ├── SendMessages.css
│   │   ├── TaskListing.css
│   │   ├── Tooltip.css
│   │   ├── Topbar.css
│   │   ├── UserActivity.css
│   │   └── UserListing.css
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   └── reportWebVitals.js
├── .dockerignore
├── .eslintric.json
├── .gitignore
├── default.conf
├── Dockerfile
├── package-lock.json
├── package.json
└── README.md
```

---

## Features

- **React**: Built with the latest React standards (functional components, hooks).
- **API Layer**: Centralized API logic in `/src/api/` for clear API management.
- **Redux**: State management with Redux for scalable data flow.
- **Authentication & Authorization**: Support for login, registration, and admin/user roles.
- **Reusable Components**: Collection of modals, tooltips, loading elements, etc.
- **Protected Routes**: Guards for private/admin-only routes.
- **Responsive UI**: Styled with modular CSS.
- **Dockerized**: Containerized for easy deployment.
- **Linting**: Configured with ESLint.

---

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/my-react-app.git
   cd my-react-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   ```bash
   npm start
   ```

   The app will run at [http://localhost:3000](http://localhost:3000).

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Available Scripts

- `npm start` — Runs the app in development mode.
- `npm test` — Launches the test runner.
- `npm run build` — Builds the app for production.
- `npm run lint` — Runs ESLint to check for code style issues.

---

## Project Folders

- **/public/**: Static files and app entry point.
- **/src/api/**: API integration modules (Auth, User, Task, etc).
- **/src/common/**: Shared UI components (Navbar, Modal, Tooltip, etc).
- **/src/components/**: Main application components (Dashboard, Login, Listings, etc).
- **/src/pages/**: Top-level page components (e.g., LoginPage).
- **/src/redux/**: Redux setup, reducers, and store configuration.
- **/src/style/**: CSS files for components and pages.

---

## Docker Support

1. **Build Docker image:**

   ```bash
   docker build -t my-react-app .
   ```

2. **Run the container:**

   ```bash
   docker run -p 3000:3000 my-react-app
   ```

3. **Configuration:**
   - `.dockerignore` — Files to ignore during Docker build.
   - `default.conf`, `Dockerfile` — NGINX/React Docker configuration.
