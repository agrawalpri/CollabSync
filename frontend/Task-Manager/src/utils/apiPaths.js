

// utils/apiPaths.js

export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",  // Register a new user
    LOGIN: "/api/auth/login",        // Authenticate user
    GET_PROFILE: "/api/auth/profile" // Get logged-in user details
  },

  USERS: {
    GET_ALL_USERS: "/api/users",                       // Get all users
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users",                         // Create a new user
    UPDATE_USER: (userId) => `/api/users/${userId}`,    // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`     // Delete a user
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",                       // Get dashboard data
    GET_USER_DASHBOARD_DATA: (userId) => `/api/tasks/user-dashboard-data/${userId}`, // Get user dashboard data
    GET_ALL_TASKS: "/api/tasks",                                           // Get all tasks
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,                    // Get task by ID
    CREATE_TASK: "/api/tasks",                                             // Create a new task
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,                       // Update task
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,                       // Delete a task

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,         // Update task status
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`         // Update todo checklist
  }
};
