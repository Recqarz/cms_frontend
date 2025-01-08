import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PendingTask = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from localStorage and combine them into one array
  const getTasksFromLocalStorage = () => {
    const highTasks = JSON.parse(localStorage.getItem("highTasks")) || [];
    const lowTasks = JSON.parse(localStorage.getItem("lowTasks")) || [];
    return [...highTasks, ...lowTasks]; s
  };

  const fetchTaskStatus = async (taskId) => {
    console.log(taskId)
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch the task status");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/task/update-status/${taskId}`,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setTasks(response.data.tasks); // Assuming response contains updated tasks
        toast.success(response.data.message);
      } else {
        toast.error("Failed to fetch task status");
      }
    } catch (error) {
      console.error("Error fetching task status:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to fetch task status.";
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    const tasksFromLocalStorage = getTasksFromLocalStorage();
    setTasks(tasksFromLocalStorage); // Set tasks from local storage to state
  }, []);

  return (
    <div className="border border-red-500 p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Tasks</h1>
      {tasks.length === 0 ? (
        <p>No pending tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{task.title}</span> {/* Display task title */}
                <button
                  onClick={() => fetchTaskStatus(task._id)} // Pass taskId to fetchTaskStatus
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Update Status
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingTask;
