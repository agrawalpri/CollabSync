import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // or your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;  // ✅ default export


// Your backend runs on:
// 👉 http://localhost:8000

// Your frontend (React) runs on:
// 👉 http://localhost:3000