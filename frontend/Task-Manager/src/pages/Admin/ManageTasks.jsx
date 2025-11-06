import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [statusSummary, setStatusSummary] = useState({
    all: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, { params });
      setTasks(response.data.tasks || []);
      setStatusSummary(response.data.statusSummary || statusSummary);
    } catch (err) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `tasks-report-${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully!");
    } catch {
      toast.error("Failed to download report");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? "st" : 
                   day === 2 || day === 22 ? "nd" : 
                   day === 3 || day === 23 ? "rd" : "th";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-pink-100 text-pink-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <span>📄</span>
          <span>Download Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All{" "}
            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
              {statusSummary.all}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("Pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending{" "}
            <span className="ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
              {statusSummary.pendingTasks}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("in-progress")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "in-progress"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress{" "}
            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
              {statusSummary.inProgressTasks}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "Completed"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed{" "}
            <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
              {statusSummary.completedTasks}
            </span>
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const completedCount = task.completedTodoCount || 
              task.todoChecklists?.filter((item) => item.completed).length || 0;
            const totalTodos = task.todoChecklists?.length || 0;
            const progress = totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0;

            return (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/admin/task-details/${task._id}`)}
              >
                {/* Status and Priority Tags */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                  </span>
                </div>

                {/* Task Title */}
                <h3 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {task.description || "No description provided"}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Task Done: {completedCount} / {totalTodos}</span>
                    <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Start Date:</span>{" "}
                    {task.createdAt ? formatDate(task.createdAt) : "N/A"}
                  </div>
                  <div>
                    <span className="font-medium">Due Date:</span>{" "}
                    {task.dueDate ? formatDate(task.dueDate) : "N/A"}
                  </div>
                </div>

                {/* Assigned Users and Attachments */}
                <div className="flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {task.assignedTo && (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {typeof task.assignedTo === "object" && task.assignedTo.name
                          ? task.assignedTo.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                    )}
                  </div>
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <span>📎</span>
                      <span className="text-xs">{task.attachments.length}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No tasks found. Create your first task!
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTasks;
