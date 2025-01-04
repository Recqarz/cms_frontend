import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HiDocumentAdd } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

const TaskManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lowTasks, setLowTasks] = useState([]);
  const [mediumTasks, setMediumTasks] = useState([]);
  const [highTasks, setHighTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    priority: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const openEditDialog = (task) => {
    setNewTask({
      ...task,
      date: new Date(task.dueDate).toISOString().split("T")[0],
    });
    setEditingTaskId(task._id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (isEditing) {
      await handleEditTask(editingTaskId, newTask);
    } else {
      await handleAddTask();
    }
    setIsDialogOpen(false);
    setNewTask({ title: "", description: "", date: "", priority: "" });
    setIsEditing(false);
    setEditingTaskId(null);
  };

  const handleEditTask = async (taskId, updatedTask) => {
    try {
      const token = JSON.parse(localStorage.getItem("cmstoken"));

      if (!token) {
        throw new Error("Unauthorized: No token found. Please log in.");
      }

      const dueDateTimestamp = new Date(updatedTask.date).getTime();

      await axios.put(
        `${import.meta.env.VITE_API_URL}/task/edit-task/${taskId}`,
        {
          ...updatedTask,
          dueDate: dueDateTimestamp,
        },
        {
          headers: { token },
        }
      );

      toast.success("Task updated successfully.");

      // Fetch tasks after editing
      await fetchTasks();
    } catch (error) {
      console.error(
        "Error editing task:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const fetchTasks = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch Tasks");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/get-alltask`, {
        headers: { token },
      })
      .then((response) => {
        console.log("Tasks fetched successfully:", response.data.data);
        setLowTasks(response.data.lowTasks);
        setMediumTasks(response.data.mediumTasks);
        setHighTasks(response.data.highTasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        const errorMsg =
          error.response?.message || "Failed to fetch tasks. Please try again.";
        toast.error(errorMsg);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    const dueDateTimestamp = new Date(newTask.date).getTime();

    const payload = {
      title: newTask.title,
      description: newTask.description,
      dueDate: dueDateTimestamp,
      priority: newTask.priority,
    };

    try {
      const token = JSON.parse(localStorage.getItem("cmstoken"));

      if (!token) {
        throw new Error("Unauthorized: No token found. Please log in.");
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/task/add-task`,
        payload,
        {
          headers: { token },
        }
      );

      toast.success("Task added successfully!");

      // Fetch tasks after adding
      await fetchTasks();

      setNewTask({ title: "", description: "", date: "", priority: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error(
        "Error adding task:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = JSON.parse(localStorage.getItem("cmstoken"));

      if (!token) {
        throw new Error("Unauthorized: No token found. Please log in.");
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/task/delete-task/${taskId}`,
        {
          headers: { token },
        }
      );

      console.log("Task deleted successfully.");

      setLowTasks((prev) => prev.filter((task) => task._id !== taskId));
      setMediumTasks((prev) => prev.filter((task) => task._id !== taskId));
      setHighTasks((prev) => prev.filter((task) => task._id !== taskId));

      toast.success("Task deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting task:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative">
      <div className="shadow-xl rounded-xl p-8 bg-white">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 transition duration-300"
          >
            <HiDocumentAdd className="mr-2 text-xl" />
            <span className="text-lg font-semibold">Add Task</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-[450px] scrollbar-hide">
          {["low", "medium", "high"].map((priority) => (
            <div
              key={priority}
              className={`rounded-xl p-6 shadow-md ${
                priority === "low"
                  ? "bg-green-100"
                  : priority === "medium"
                  ? "bg-yellow-100"
                  : "bg-red-100"
              } transition-all duration-500 ease-in-out hover:scale-105`}
            >
              <h3
                className={`font-bold text-xl mb-4 capitalize transition-all duration-300 ease-in-out ${
                  priority === "low"
                    ? "text-green-700"
                    : priority === "medium"
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                {priority} Priority
              </h3>

              <ul className="space-y-4 rounded-lg p-2 bg-gray-50 shadow-md">
                {(priority === "low"
                  ? lowTasks
                  : priority === "medium"
                  ? mediumTasks
                  : highTasks
                ).length > 0 ? (
                  (priority === "low"
                    ? lowTasks
                    : priority === "medium"
                    ? mediumTasks
                    : highTasks
                  ).map((task) => (
                    <li
                      key={task._id}
                      className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-[22px] font-semibold block">
                            {task.title}
                          </strong>
                          <div className="relative group w-[300px]">
                            {/* Truncated description */}
                            <p className="text-lg text-white/90 mt-1 line-clamp-2 truncate w-full group-hover:line-clamp-none group-hover:h-auto group-hover:overflow-visible group-hover:whitespace-normal group-hover:bg-white/90 group-hover:text-black group-hover:p-2 group-hover:shadow-lg transition-all duration-300 ease-in-out">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <span className="text-md text-white/80 bg-white/20 px-2 py-1 rounded-full">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => openEditDialog(task)}
                            className="rounded text-white transition duration-200 ease-in-out hover:p-2 hover:rounded-full hover:bg-yellow-500 hover:text-black hover:shadow-lg"
                          >
                            <FaRegEdit className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="rounded text-white transition duration-200 ease-in-out hover:p-2 hover:rounded-full hover:bg-red-500 hover:shadow-lg"
                          >
                            <MdDeleteForever className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="flex justify-center items-center text-[#6E6893] text-lg font-bold">
                    No tasks available
                  </p>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-purple-900">
              {isEditing ? "Edit Task" : "Add Task"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div>
              <label
                htmlFor="task-title"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                placeholder="Enter Task Title"
              />
            </div>
            <div>
              <label
                htmlFor="task-description"
                className="block text-sm font-medium mb-2"
              >
                Task Description
              </label>
              <textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                placeholder="Enter Task Description"
              />
            </div>
            <div>
              <label
                htmlFor="due-date"
                className="block text-sm font-medium mb-2"
              >
                Due Date
              </label>
              <input
                id="due-date"
                type="date"
                value={newTask.date}
                onChange={(e) =>
                  setNewTask({ ...newTask, date: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="task-priority"
                className="block text-sm font-medium mb-2"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
              >
                <option value="">Please select priority</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-progress"
                className="block text-sm font-medium mb-2"
              >
                Progress
              </label>
              <select
                id="task-progress"
                value={newTask.progress}
                onChange={(e) =>
                  setNewTask({ ...newTask, progress: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
              >
                <option value="">What's Your Progress</option>
                <option value="low">In Process</option>
                <option value="medium">Completed</option>
                <option value="high">In Pending</option>
              </select>
            </div>
          </div>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => {
                setIsDialogOpen(false);
                setIsEditing(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveTask}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
            >
              {isEditing ? "Save Changes" : "Add Task"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;
