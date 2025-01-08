import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PendingTask = () => {
  const [task, setTask] = useState([]);
  

  const fetchTaskStatus = async (id) => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch the task status");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/task/update-status/${id}`,
       
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setTask(response.data.task); // Update state with task data
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

  return (
    <div className="border border-red-500 p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Task</h1>
      {task ? (
        <div className="p-4 bg-white rounded-xl shadow-md">
          <h3 className="text-lg font-bold">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <p className="text-sm text-blue-600">
            Due Date: {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p className="text-sm font-bold">Status: {task.status}</p>
          {task.attachments?.length > 0 && (
            <div className="mt-3">
              <strong className="block text-sm text-gray-700">Attachments:</strong>
              {task.attachments.map((file, index) => (
                <Link
                  key={index}
                  href={file.url}
                  download
                  className="block text-blue-600 text-sm hover:underline"
                >
                  {file.name || "View Document"}
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-red-500">No pending task found!</p>
      )}
    </div>
  );
};

export default PendingTask;
