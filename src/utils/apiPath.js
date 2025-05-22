const BASE_URL = "http://34.143.146.38";

const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user & return a JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged in user details
  },

  USER: {
    GET_ALL_USERS: "/api/user", // Get all users (Admin only)
    GET_USER_BY_ID: (userId) => `/api/user/${userId}`, // Get user by ID
    CREATE_USER: "/api/user", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/user/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/user/${userId}`, // Delete a user
  },

  TASK: {
    GET_DASHBOARD_DATA: "/api/task/dashboard-data", // Get dashboard data
    GET_USER_DASHBOARD_DATA: "/api/task/user-dashboard-data", // Get user dashboard data
    GET_ALL_TASKS: "/api/task", // Get all tasks (Admin: all, user: only assigned)
    GET_TASK_BY_ID: (taskId) => `/api/task/${taskId}`, // Get task by ID
    CREATE_TASK: "/api/task", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/task/${taskId}`, // Update task details
    DELETE_TASK: (taskId) => `/api/task/${taskId}`, // Delete a task (Admin only)

    UPDATE_TASK_STATUS: (taskId) => `/api/task/${taskId}/status`, // Update task status
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/task/${taskId}/todo`, // Update todo checklist
  },

  REPORT: {
    EXPORT_TASK: "/api/report/export/tasks", // Download all task as an Excel file
    EXPORT_USER: "/api/report/export/users", // Download user-task report
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image", // Upload image to server
  },
};

export { API_PATHS, BASE_URL };
