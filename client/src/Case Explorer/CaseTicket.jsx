import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Pagination from "../components/pagination/pagination";

import Nodatafound from "../assets/Images/Nodata_found.png";

import { MdDoNotDisturb } from "react-icons/md"; // No entry

import { FcAcceptDatabase } from "react-icons/fc";

const CaseTicket = () => {
  const [documents, setDocuments] = useState([
    { id: Date.now(), docName: "", file: null },
  ]);

  const [tasks, setTasks] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
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

  const fetchTasks = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch tasks");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/get-requested-task`, {
        headers: { token },
      })
      .then((response) => {
        console.log("API Response:", response);

        const { tasks, mediumTasks, highTasks } = response.data;
        setTasks(response.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        const errorMsg =
          error.response?.data?.message ||
          "Failed to fetch tasks. Please try again.";
        toast.error(errorMsg);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAcceptTask = async (taskId) => {
    try {
      const token = JSON.parse(localStorage.getItem("cmstoken")); // Token retrieve kiya
      if (!token) {
        toast.error("Unauthorized: No token provided");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/task/accept-completed-task/${taskId}`,
        {},
        { headers: { token: token } }
      );

      toast.success(response.data.message || "Task accepted successfully");
      fetchTasks(); // Task list ko refresh karne ke liye
    } catch (error) {
      console.error("Error accepting task:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to accept the task";
      toast.error(errorMsg);
    }
  };

  const handleRejectTask = async (taskId) => {
    try {
      const token = JSON.parse(localStorage.getItem("cmstoken")); // Token retrieve kiya
      if (!token) {
        toast.error("Unauthorized: No token provided");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/task/reject-task/${taskId}`,
        {},
        { headers: { token: token } }
      );

      toast.success(response.data.message || "Task rejected successfully");
      fetchTasks(); // Task list ko refresh karne ke liye
    } catch (error) {
      console.error("Error rejecting task:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to reject the task";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="relative">
      <div className="shadow-lg rounded-xl p-4 bg-white">
        <div>
          <h1 className="text-2xl text-center text-[#5a518c] mb-5 font-bold">
            All Assigned Tasks
          </h1>
        </div>
        {/* Table header always visible */}
        <div className="overflow-x-auto w-full">
          <table className="w-full border rounded-lg">
            <thead className="bg-[#F4F2FF] text-[#6E6893]">
              <tr>
                <th className="py-3 px-4 text-left">CNR NUMBER</th>
                <th className="py-3 px-4 text-left">TITLE</th>
                <th className="py-3 px-4 text-left">DESCRIPTION</th>
                <th className="py-3 px-4 text-left">PRIORITY</th>
                <th className="py-3 px-4 text-left">RESPONDER</th>
                <th className="py-3 px-4 text-center">REMARKS</th>
                <th className="py-3 px-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <img
                        src={Nodatafound}
                        alt="No cases found"
                        className="max-w-xs mx-auto p-8"
                      />
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr
                    key={task._id}
                    className={`bg-white hover:bg-gray-100 ${
                      index % 2 !== 0 && "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-4">{task.cnrNumber}</td>
                    <td className="py-3 px-4">{task.title}</td>
                    <td className="py-3 px-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {task.description?.slice(0, 20)}
                          </TooltipTrigger>
                          <TooltipContent>{task.description}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4">{task.priority}</td>
                    <td className="py-3 px-4">{task.responder}</td>
                    <td className="py-3 px-4 text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {task.remarks?.slice(0, 20)}
                          </TooltipTrigger>
                          <TooltipContent>{task.remarks}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleAcceptTask(task._id)}
                          className="bg-green-200 text-green-500 px-4 py-2 rounded-md hover:bg-green-400 hover:text-white flex items-center gap-2 ml-2"
                        >
                          <FcAcceptDatabase /> Accept
                        </button>

                        <button
                          onClick={() => handleRejectTask(task._id)}
                          className="bg-red-200 text-red-500 px-4 py-2 rounded-md hover:bg-red-400 hover:text-white flex items-center gap-2 ml-2"
                        >
                          <MdDoNotDisturb /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={setPageLimit}
      />
    </div>
  );
};

export default CaseTicket;
