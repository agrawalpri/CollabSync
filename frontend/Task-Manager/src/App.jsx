import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/Users/UserDashboard";
import MyTasks from "./pages/Users/MyTasks";
import ViewTaskDetails from "./pages/Users/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/Users" element={<ManageUsers />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/Users/dashboard" element={<UserDashboard />} />
            <Route path="/Users/my-tasks" element={<MyTasks />} />
            <Route
              path="/Users/task-details/:id"
              element={<ViewTaskDetails />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
