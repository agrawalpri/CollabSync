import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />

          {/* Admin Routes */}
          <Route element = {<PrivateRoute allowedRoles = {["admin"]} />} >
            <Route path="/admin/dashboard" element={<Dashboard/>} />
            <Route path="/admin/tasks" element={<ManageTasks/>} />
            <Route path="/admin/create-task" element={<CreateTask/>} />
             <Route path="/admin/Users" element={<ManageUsers/>} />        
          </Route>

          {/* User Routes */}
          <Route element = {<PrivateRoute allowedRoles = {["admin"]} />} >
            <Route path="/Users/dashboard" element={<UserDashboard/>} />
            <Route path="/Users/tasks" element={<MyTasks/>} />
            <Route path="/Users/task-deatails/:id" element={<ViewTaskDetails/>} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App;