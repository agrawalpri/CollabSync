import React, { useContext } from "react";
import UserProvider from "./context/userContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { UserContext } from "./context/userContext";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./components/layouts/DashboardLayout";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Root route: redirect based on authenticated user's role */}
            <Route path="/" element={<Root />} />

            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes with DashboardLayout */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<DashboardLayout><Outlet /></DashboardLayout>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tasks" element={<ManageTasks />} />
                <Route path="create-task" element={<CreateTask />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="task-details/:id" element={<ViewTaskDetails />} />
              </Route>
            </Route>

            {/* User Routes with DashboardLayout */}
            <Route element={<PrivateRoute allowedRoles={["user", "member"]} />}>
              <Route path="/users" element={<DashboardLayout><Outlet /></DashboardLayout>}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="my-tasks" element={<MyTasks />} />
                <Route path="task-details/:id" element={<ViewTaskDetails />} />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />
  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/users/dashboard" />;
};
