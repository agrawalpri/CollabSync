import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      setTask(response.data);
    } catch (err) {
      toast.error("Failed to fetch task details");
      console.error("Error fetching task:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChecklistToggle = async (index) => {
    if (!task) return;

    const updatedChecklist = [...task.todoChecklists];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      setUpdating(true);
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(task._id), {
        todoChecklist: updatedChecklist,
      });
      setTask({ ...task, todoChecklists: updatedChecklist });
      toast.success("Checklist updated");
    } catch {
      toast.error("Failed to update checklist");
    } finally {
      setUpdating(false);
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
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!task) {
    return <div className="text-center text-red-500">Task not found</div>;
  }

  const completedCount = task.todoChecklists?.filter((item) => item.completed).length || 0;
  const totalTodos = task.todoChecklists?.length || 0;
  const progress = totalTodos > 0 ? Math.round((completedCount / totalTodos) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{task.description || "No description provided"}</p>
        </div>

        {/* Task Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Created On</h3>
            <p className="text-gray-800">
              {task.createdAt ? formatDate(task.createdAt) : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Due Date</h3>
            <p className="text-gray-800">
              {task.dueDate ? formatDate(task.dueDate) : "N/A"}
            </p>
          </div>
          {task.assignedTo && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Assigned To</h3>
              <p className="text-gray-800">
                {typeof task.assignedTo === "object" 
                  ? task.assignedTo.name || task.assignedTo.email 
                  : "N/A"}
              </p>
            </div>
          )}
          {task.createdBy && (
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Created By</h3>
              <p className="text-gray-800">
                {typeof task.createdBy === "object" 
                  ? task.createdBy.name || task.createdBy.email 
                  : "N/A"}
              </p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Progress</h2>
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Task Done: {completedCount} / {totalTodos}</span>
              <span className="text-sm font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Todo Checklist */}
        {task.todoChecklists && task.todoChecklists.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Todo Checklist</h2>
            <div className="space-y-2">
              {task.todoChecklists.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    item.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(index)}
                    disabled={updating}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`flex-1 ${
                      item.completed ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Attachments</h2>
            <div className="space-y-2">
              {task.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <span>📎</span>
                  <span>{attachment}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTaskDetails;
