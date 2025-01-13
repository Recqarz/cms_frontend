import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiDocumentAdd } from "react-icons/hi";
import { MdOutlineFileUpload } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { FcAcceptDatabase } from "react-icons/fc";

const Subtask = () => {
  const [documents, setDocuments] = useState([
    { id: Date.now(), docName: "", file: null },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lowTasks, setLowTasks] = useState([]);
  const [mediumTasks, setMediumTasks] = useState([]);
  const [highTasks, setHighTasks] = useState([]);
  const [requestedTasks, setRequestedTasks] = useState([]); // New state for requested tasks
  const [remarks, setRemarks] = useState("");
  const [taskId, setTaskId] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    priority: "",
    status: "Pending",
    cnrNumber: "",
    remark: "",
  });
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const handleHover = (taskId) => setExpandedTaskId(taskId);
  const handleMouseLeave = () => setExpandedTaskId(null);

  function handleCompleteRequest() {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to complete request");
      return;
    }
    if (!taskId) {
      toast.error("Please select a task to complete");
      return;
    }
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/task/edit-sub-task/${taskId}`,
        {
          remarks: remarks,
        },
        {
          headers: { token },
        }
      )
      .then((response) => {
        toast.success("Request completed successfully");
        fetchTasks();
        setIsDialogOpen(false);
        setRemarks("");
        setTaskId("");
      })
      .catch((error) => {
        console.error("Error completing request:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to complete request. Please try again.";
        toast.error(errorMsg);
      });
  }

  const fetchTasks = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch tasks");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/get-sub-alltask`, {
        headers: { token },
      })
      .then((response) => {
        const { lowTasks, mediumTasks, highTasks } = response.data;
        setLowTasks(lowTasks || []);
        setMediumTasks(mediumTasks || []);
        setHighTasks(highTasks || []);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to fetch tasks. Please try again.";
        toast.error(errorMsg);
      });
  };

  const fetchRequestedTasks = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch requested tasks");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/get-requested-task`, {
        headers: { token },
      })
      .then((response) => {
        setRequestedTasks(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching requested tasks:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to fetch requested tasks. Please try again.";
        toast.error(errorMsg);
      });
  };

  useEffect(() => {
    fetchTasks();
    fetchRequestedTasks(); 
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      setNewTask({
        title: "",
        description: "",
        date: "",
        priority: "",
        status: "Pending",
        cnrNumber: "",
      });
      setDocuments([{ id: Date.now(), docName: "", file: null }]);
      setIsEditing(false);
      setCurrentTaskId(null);
    }
  }, [isDialogOpen]);

  const handleAddFields = () => {
    setDocuments([...documents, { id: Date.now(), docName: "", file: null }]);
  };

  const handleRemoveFields = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleChange = (id, key, value) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              [key]: value,
              ...(key === "file" && { fileName: value.name }),
            }
          : doc
      )
    );
  };

  return (
    <div className="relative">
      <div className="shadow-xl rounded-xl p-8 bg-white">
        <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-[450px] scrollbar-hide">
          {["low", "medium", "high"].map((priority) => (
            <div
              key={priority}
              className={`rounded-xl p-5 mb-2 shadow-md hover:shadow-md ${
                priority === "low"
                  ? "bg-green-100"
                  : priority === "medium"
                  ? "bg-yellow-50"
                  : "bg-red-50"
              } transition-transform duration-500 ease-in-out`}
            >
              <h3
                className={`font-bold text-xl mb-4 capitalize transition-all duration-300 ease-in-out ${
                  priority === "low"
                    ? "text-green-700"
                    : priority === "medium"
                    ? "text-yellow-800"
                    : "text-red-700"
                }`}
              >
                {priority} Priority
              </h3>

              <ul className=" space-y-4 rounded-lg p-2">
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
                      className="p-4 bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-l-4 border-l-[#7b6cd2] hover:border-l-blue-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-xl font-bold block text-[#6E6893]">
                            {task.cnrNumber}
                          </strong>
                          <strong className="text-[20px] font-bold block text-gray-600">
                            {task.title}
                          </strong>
                          <p
                            className="text-sm text-gray-600 mt-2"
                            onMouseEnter={() => handleHover(task._id)}
                            onMouseLeave={handleMouseLeave}
                            style={{ cursor: "pointer" }}
                          >
                            {expandedTaskId === task._id
                              ? task.description
                              : `${task.description?.slice(0, 20)}...`}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm text-blue-600">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 font-bold">
                            {task.status || "N/A"}
                          </span>
                          {task.attachments && task.attachments.length > 0 && (
                            <div className="mt-3">
                              <strong className="block text-sm text-gray-700">
                                Files:
                              </strong>
                              {task.attachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="mt-1 flex gap-[10px] "
                                >
                                  <span className="text-sm text-gray-800">
                                    {file.name}:
                                  </span>
                                  <a
                                    href={file.url}
                                    download
                                    className="block text-blue-600 text-sm hover:underline"
                                  >
                                    View Doc
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {/* <button
                            // onClick={() => handleEditTask(task)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Edit
                          </button> */}
                          {task.action === "assign" ? (
                            <button
                              onClick={() => {
                                setTaskId(task._id);
                                setIsDialogOpen(true);
                              }}
                              className="text-sm text-green-600 hover:underline"
                            >
                              Request to Complete
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="flex justify-center items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-xl p-4">
                    No tasks available
                  </p>
                )}
              </ul>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 scrollbar-hide">
            <DialogHeader>
              <DialogTitle className="text-[24px] font-semibold text-purple-900">
                {isEditing ? "Edit Task" : "Add Task"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>
            <div>
              <div className="flex flex-wrap items-center space-x-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-600 px-5 mb-2"
                >
                  Remark
                </label>
                <input
                  id="title"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setTaskId("");
                  setRemarks("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCompleteRequest}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
              >
                Submit
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Subtask;
