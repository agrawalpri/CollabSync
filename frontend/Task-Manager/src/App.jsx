// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Auth/Login";
// import SignUp from "./pages/Auth/SignUp";
// import Dashboard from "./pages/Admin/Dashboard";
// import ManageTasks from "./pages/Admin/ManageTasks";
// import CreateTask from "./pages/Admin/CreateTask";
// import ManageUsers from "./pages/Admin/ManageUsers";
// import UserDashboard from "./pages/Users/UserDashboard";
// import MyTasks from "./pages/Users/MyTasks";
// import ViewTaskDetails from "./pages/Users/ViewTaskDetails";
// import PrivateRoute from "./routes/PrivateRoute";

// const App = () => {
//   return (
//     <div>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />   // change
//           <Route path="/signup" element={<SignUp />} />

//           {/* Admin Routes */}
//           <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
//             <Route path="/admin/dashboard" element={<Dashboard />} />
//             <Route path="/admin/tasks" element={<ManageTasks />} />
//             <Route path="/admin/create-task" element={<CreateTask />} />
//             <Route path="/admin/Users" element={<ManageUsers />} />   // change 
//           </Route>

//           {/* User Routes */}
//           <Route element={<PrivateRoute allowedRoles={["admin"]} />}>    // user
//             <Route path="/Users/dashboard" element={<UserDashboard />} />
//             <Route path="/Users/my-tasks" element={<MyTasks />} />
//             <Route
//               path="/Users/task-details/:id"
//               element={<ViewTaskDetails />}
//             />
//           </Route>
//         </Routes>
//       </Router>
//     </div>
//   );
// };

// export default App;


//changes
///users/dashboard → works

///Users/dashboard → also works but must be typed exactly like that in the browser





import React from "react";
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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route "/" redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/users/dashboard" element={<UserDashboard />} />
          <Route path="/users/my-tasks" element={<MyTasks />} />
          <Route path="/users/task-details/:id" element={<ViewTaskDetails />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
