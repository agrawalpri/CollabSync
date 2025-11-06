import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  Pending: "#9333EA", // Purple
  "In Progress": "#14B8A6", // Teal
  Completed: "#10B981", // Green
};

const PRIORITY_COLORS = {
  Low: "#10B981", // Green
  Medium: "#F59E0B", // Orange
  High: "#EF4444", // Red
};

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
      setDashboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDate = () => {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : 
                   day === 2 || day === 22 ? "nd" : 
                   day === 3 || day === 23 ? "rd" : "th";
    return `${days[date.getDay()]} ${day}${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="text-center text-red-500">Failed to load dashboard data</div>;
  }

  const { statistics, charts, recentTasks } = dashboardData;

  const statusData = [
    { name: "Pending", value: charts?.taskDistribution?.Pending || 0, color: COLORS.Pending },
    { name: "In Progress", value: charts?.taskDistribution?.InProgress || 0, color: COLORS["In Progress"] },
    { name: "Completed", value: charts?.taskDistribution?.Completed || 0, color: COLORS.Completed },
  ];

  const priorityData = [
    { name: "Low", value: charts?.taskPriorityLevels?.Low || 0 },
    { name: "Medium", value: charts?.taskPriorityLevels?.Medium || 0 },
    { name: "High", value: charts?.taskPriorityLevels?.High || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}! {user?.name || "User"}
        </h1>
        <p className="text-gray-600">{getCurrentDate()}</p>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-1 h-12 bg-blue-600 rounded"></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{statistics?.totatlTask || 0}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-1 h-12 bg-purple-600 rounded"></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{statistics?.pendingTasks || 0}</p>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-1 h-12 bg-teal-600 rounded"></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{statistics?.inProgressTasks || 0}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-1 h-12 bg-green-600 rounded"></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{statistics?.completedTask || 0}</p>
              <p className="text-sm text-gray-600">Completed Tasks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                formatter={(value) => value}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Task Priority Levels Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Task Priority Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Tasks</h3>
          <button
            onClick={() => navigate("/admin/tasks")}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>See All</span>
            <span>→</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                <th className="text-left p-3 font-semibold text-gray-700">Priority</th>
                <th className="text-left p-3 font-semibold text-gray-700">Created On</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks?.length > 0 ? (
                recentTasks.map((task) => (
                  <tr key={task._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{task.title}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in-progress" || task.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">
                      {new Date(task.createdAt || task.dueDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent tasks
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
