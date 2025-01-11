// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { HiDocumentAdd } from "react-icons/hi";
// import { FaRegEdit } from "react-icons/fa";
// import { MdDeleteForever, MdOutlineFileUpload } from "react-icons/md";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/dialog";

// const TaskManagement = () => {
//   const [documents, setDocuments] = useState([
//     { id: Date.now(), docName: "", file: null },
//   ]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [lowTasks, setLowTasks] = useState([]);
//   const [mediumTasks, setMediumTasks] = useState([]);
//   const [highTasks, setHighTasks] = useState([]);
//   const [newTask, setNewTask] = useState({
//     title: "",
//     description: "",
//     date: "",
//     priority: "",
//     status: "Pending",
//   });
//   const [expandedTaskId, setExpandedTaskId] = useState(null);
//   const handleHover = (taskId) => setExpandedTaskId(taskId);
//   const handleMouseLeave = () => setExpandedTaskId(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingTaskId, setEditingTaskId] = useState(null);

//   const handleAddTask = async () => {
//     let token;
//     try {
//       token = JSON.parse(localStorage.getItem("cmstoken"));
//     } catch (e) {
//       toast.error("Invalid token format in local storage.");
//       return;
//     }
//     if (!token) {
//       toast.error("You are not logged in.");
//       return;
//     }
//     if (
//       !newTask.title ||
//       !newTask.description ||
//       !newTask.date ||
//       !newTask.priority ||
//       !newTask.cnrNumber
//     ) {
//       toast.error("Please fill all required fields.");
//       return;
//     }

//     // Validate API URL
//     const apiUrl = import.meta.env.VITE_API_URL;
//     if (!apiUrl) {
//       console.error("API URL is not defined in environment variables.");
//       toast.error("Server configuration is missing.");
//       return;
//     }

//     try {
//       const dueDate = new Date(newTask.date).toISOString();
//       const formData = new FormData();
//       formData.append("title", newTask.title.trim());
//       formData.append("description", newTask.description.trim());
//       formData.append("dueDate", dueDate);
//       formData.append("priority", newTask.priority);
//       formData.append("cnrNumber", newTask.cnrNumber.trim());
//       formData.append("status", newTask.status || "pending");
//       if (!Array.isArray(documents)) {
//         toast.error("Invalid document data.");
//         return;
//       }
//       documents.forEach((doc) => {
//         if (doc.file) {
//           formData.append("files", doc.file);
//           formData.append("fileNames", doc.docName);
//         }
//       });
//       await axios
//         .post(`${apiUrl}/task/add-task`, formData, {
//           headers: {
//             token,
//             "Content-Type": "multipart/form-data",
//           },
//         })
//         .then((response) => {
//           toast.success("Task added successfully.");
//           fetchTasks();
//           setNewTask({
//             title: "",
//             description: "",
//             date: "",
//             priority: "",
//             status: "",
//             cnrNumber: "",
//           });
//           setDocuments([{ id: Date.now(), docName: "", file: null }]);
//           setIsDialogOpen(false);
//           setExpandedTaskId(null);
//           setIsEditing(false);
//           setEditingTaskId(null);
//         })
//         .catch((error) => {
//           const errorMessage =
//             error.response?.data?.message || "An unexpected error occurred.";
//           console.error(
//             "Error adding task:",
//             error.response?.data || error.message
//           );
//           toast.error(errorMessage);
//         });
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message || "An unexpected error occurred.";
//       console.error("Error adding task:", error.message);
//       toast.error(errorMessage);
//     }
//   };

//   const handleSaveTask = async () => {
//     if (
//       !newTask.title ||
//       !newTask.description ||
//       !newTask.date ||
//       !newTask.priority ||
//       (isEditing && !newTask.status)
//     ) {
//       toast.error("Please fill all required fields.");
//       return;
//     }
//     try {
//       if (isEditing) {
//         await handleEditTask(editingTaskId, newTask);
//       } else {
//         await handleAddTask();
//       }
//     } catch (error) {
//       toast.error("An error occurred while saving the task.");
//     }
//   };
//   const fetchTasks = () => {
//     const token = JSON.parse(localStorage.getItem("cmstoken"));
//     if (!token) {
//       toast.error("Please login again to fetch tasks");
//       return;
//     }
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/task/get-alltask`, {
//         headers: { token },
//       })
//       .then((response) => {
//         const { lowTasks, mediumTasks, highTasks } = response.data;
//         setLowTasks(lowTasks || []);
//         setMediumTasks(mediumTasks || []);
//         setHighTasks(highTasks || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching tasks:", error);
//         const errorMsg =
//           error.response?.data?.message ||
//           "Failed to fetch tasks. Please try again.";
//         toast.error(errorMsg);
//       });
//   };
//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   <button
//     onClick={handleSaveTask}
//     className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
//   >
//     {isEditing ? "Save Changes" : "Add Task"}
//   </button>;

//   const openEditDialog = (task) => {
//     setNewTask({
//       ...task,
//       date: new Date(task.dueDate).toISOString().split("T")[0],
//     });
//     setEditingTaskId(task._id);
//     setIsEditing(true);
//     setIsDialogOpen(true);
//   };

//   useEffect(() => {
//     if (!isDialogOpen) {
//       setNewTask({
//         title: "",
//         description: "",
//         date: "",
//         priority: "",
//         status: "",
//         cnrNumber: "",
//       });
//       setEditingTaskId(null);
//       setIsEditing(false);
//       setDocuments([{ id: Date.now(), docName: "", file: null }]);
//     }
//   }, [isDialogOpen]);

//   const handleAddFields = () => {
//     setDocuments([...documents, { id: Date.now(), docName: "", file: null }]);
//   };

//   const handleRemoveFields = (id) => {
//     setDocuments(documents.filter((doc) => doc.id !== id));
//   };

//   const handleChange = (id, key, value) => {
//     setDocuments(
//       documents.map((doc) =>
//         doc.id === id
//           ? {
//               ...doc,
//               [key]: value,
//               ...(key === "file" && { fileName: value.name }),
//             }
//           : doc
//       )
//     );
//   };

//   const handleEditTask = async (taskId, updatedTask) => {
//     const token = JSON.parse(localStorage.getItem("cmstoken"));
//     if (!token) {
//       toast.error("Please login again to edit tasks");
//       return;
//     }
//     if (!taskId || !updatedTask) {
//       toast.error("Invalid task ID or updated task data");
//       return;
//     }
//     axios
//       .put(
//         `${import.meta.env.VITE_API_URL}/task/edit-task/${taskId}`,
//         updatedTask,
//         {
//           headers: { token },
//         }
//       )
//       .then((response) => {
//         toast.success("Task updated successfully.");
//         fetchTasks();
//         setIsDialogOpen(false);
//         setExpandedTaskId(null);
//         setIsEditing(false);
//         setEditingTaskId(null);
//       })
//       .catch((error) => {
//         const errorMessage =
//           error.response?.data?.message ||
//           "Failed to update task. Please try again.";
//         console.error(
//           "Error updating task:",
//           error.response?.data || error.message
//         );
//         toast.error(errorMessage);
//         setIsDialogOpen(false);
//         setExpandedTaskId(null);
//         setIsEditing(false);
//         setEditingTaskId(null);
//       });
//   };

//   const handleDeleteTask = async (taskId) => {
//     const token = JSON.parse(localStorage.getItem("cmstoken"));
//     if (!token) {
//       toast.error("Please login again to edit tasks");
//       return;
//     }
//     if (!taskId) {
//       toast.error("Invalid task ID or updated task data");
//       return;
//     }
//     axios
//       .delete(`${import.meta.env.VITE_API_URL}/task/delete-task/${taskId}`, {
//         headers: { token },
//       })
//       .then((response) => {
//         toast.success("Task deleted successfully.");
//         fetchTasks();
//         setExpandedTaskId(null);
//         setIsEditing(false);
//         setEditingTaskId(null);
//       })
//       .catch((error) => {
//         const errorMessage =
//           error.response?.data?.message ||
//           "Failed to update task. Please try again.";
//         console.error(
//           "Error updating task:",
//           error.response?.data || error.message
//         );
//         toast.error(errorMessage);
//         setExpandedTaskId(null);
//         setIsEditing(false);
//         setEditingTaskId(null);
//       });
//   };

//   return (
//     <div className="relative">
//       <div className="shadow-xl rounded-xl p-8 bg-white">
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={() => setIsDialogOpen(true)}
//             className="flex items-center px-6 py-3 bg-gradient-to-r from-[#5a518c] to-[#7b6cd2] text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-[#3d3f73] hover:to-[#6e5ecc] transition duration-300"
//           >
//             <HiDocumentAdd className="mr-2 text-xl" />
//             <span className="text-lg font-semibold">Add Task</span>
//           </button>
//         </div>

//         <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-[450px] scrollbar-hide">
//           {["low", "medium", "high"].map((priority) => (
//             <div
//               key={priority}
//               className={`rounded-xl p-5 mb-2 shadow-md hover:shadow-md ${
//                 priority === "low"
//                   ? "bg-green-100"
//                   : priority === "medium"
//                   ? "bg-yellow-50"
//                   : "bg-red-50"
//               } transition-transform duration-500 ease-in-out`}
//             >
//               <h3
//                 className={`font-bold text-xl mb-4 capitalize transition-all duration-300 ease-in-out ${
//                   priority === "low"
//                     ? "text-green-700"
//                     : priority === "medium"
//                     ? "text-yellow-800"
//                     : "text-red-700"
//                 }`}
//               >
//                 {priority} Priority
//               </h3>

//               <ul className="space-y-4 rounded-lg p-2">
//                 {(priority === "low"
//                   ? lowTasks
//                   : priority === "medium"
//                   ? mediumTasks
//                   : highTasks
//                 ).length > 0 ? (
//                   (priority === "low"
//                     ? lowTasks
//                     : priority === "medium"
//                     ? mediumTasks
//                     : highTasks
//                   ).map((task) => (
//                     <li
//                       key={task._id}
//                       className="p-4 bg-white rounded-xl shadow-md hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-l-4 border-l-[#7b6cd2] hover:border-l-blue-700"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <strong className="text-xl font-bold block text-[#6E6893]">
//                             {task.cnrNumber}
//                           </strong>
//                           <strong className="text-[20px] font-bold block text-gray-600">
//                             {task.title}
//                           </strong>
//                           <p
//                             className="text-sm text-gray-600 mt-2"
//                             onMouseEnter={() => handleHover(task._id)}
//                             onMouseLeave={handleMouseLeave}
//                             style={{ cursor: "pointer" }}
//                           >
//                             {expandedTaskId === task._id
//                               ? task.description
//                               : `${task.description?.slice(0, 20)}...`}
//                           </p>
//                           <div className="flex items-center space-x-3 mt-2">
//                             <span className="text-sm text-blue-600">
//                               Due: {new Date(task.dueDate).toLocaleDateString()}
//                             </span>
//                           </div>
//                           <span className="text-sm text-gray-600 font-bold">
//                             {task.status || "N/A"}
//                           </span>

//                           {/* Display Attachments as "View Doc" with download trigger */}
//                           {task.attachments && task.attachments.length > 0 && (
//                             <div className="mt-3">
//                               <strong className="block text-sm text-gray-700">
//                                 Files:
//                               </strong>
//                               {task.attachments.map((file, index) => (
//                                 <a
//                                   key={index}
//                                   href={file.url}
//                                   download
//                                   className="block text-blue-600 text-sm hover:underline"
//                                 >
//                                   View Doc
//                                 </a>
//                               ))}
//                             </div>
//                           )}
//                         </div>

//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => openEditDialog(task)}
//                             className="rounded-full p-2 text-gray-800 hover:bg-yellow-200 hover:text-gray-800 transition-all duration-200"
//                           >
//                             <FaRegEdit className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteTask(task._id)}
//                             className="rounded-full p-2 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-200"
//                           >
//                             <MdDeleteForever className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </div>
//                     </li>
//                   ))
//                 ) : (
//                   <p className="flex justify-center items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 font-bold text-xl p-4">
//                     No tasks available
//                   </p>
//                 )}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* <PendingTask/> */}
//       </div>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 scrollbar-hide">
//           <DialogHeader>
//             <DialogTitle className="text-[24px] font-semibold text-purple-900">
//               {isEditing ? "Edit Task" : "Add Task"}
//             </DialogTitle>
//           </DialogHeader>
//           <DialogDescription></DialogDescription>
//           <div className="space-y-3 p-4">
//             <div>
//               <label
//                 htmlFor="add-cnr"
//                 className="block text-sm font-medium mb-2 text-gray-700"
//               >
//                 CNR Number
//               </label>
//               <input
//                 id="add-cnr"
//                 type="text"
//                 value={newTask.cnrNumber}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, cnrNumber: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//                 placeholder="Enter Your CNR Number"
//               />
//             </div>

//             {!isEditing
//               ? documents.map((doc) => (
//                   <div
//                     key={doc.id}
//                     className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 space-y-4"
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-700">
//                           Document Name
//                         </label>
//                         <input
//                           type="text"
//                           value={doc.docName}
//                           onChange={(e) =>
//                             handleChange(doc.id, "docName", e.target.value)
//                           }
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//                           placeholder="Enter Document Name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-700">
//                           Upload File
//                         </label>
//                         <div className="relative">
//                           <label className="flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-white shadow-sm">
//                             <input
//                               type="file"
//                               onChange={(e) =>
//                                 handleChange(doc.id, "file", e.target.files[0])
//                               }
//                               className="hidden"
//                               accept=".pdf,.doc,.docx"
//                             />
//                             <div className="flex items-center space-x-2 text-gray-500">
//                               <MdOutlineFileUpload className="text-2xl" />
//                               <span className="text-sm truncate w-32">
//                                 {doc.fileName || "Choose file"}
//                               </span>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     {doc.error && (
//                       <Alert variant="destructive">
//                         <AlertDescription className="text-sm text-red-600">
//                           {doc.error}
//                         </AlertDescription>
//                       </Alert>
//                     )}

//                     {documents.length > 1 && (
//                       <button
//                         onClick={() => handleRemoveFields(doc.id)}
//                         className="text-sm text-red-500 hover:text-red-700 font-medium"
//                       >
//                         Remove Document
//                       </button>
//                     )}
//                   </div>
//                 ))
//               : null}

//             {!isEditing ? (
//               <button
//                 onClick={handleAddFields}
//                 className="w-full py-3 border-2 border-dashed rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-colors"
//               >
//                 + Add Another Document
//               </button>
//             ) : null}

//             <div>
//               <label
//                 htmlFor="task-title"
//                 className="block text-sm font-medium mb-2 text-gray-700"
//               >
//                 Task Title
//               </label>
//               <input
//                 id="task-title"
//                 type="text"
//                 value={newTask.title}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, title: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//                 placeholder="Enter Task Title"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="task-description"
//                 className="block text-sm font-medium mb-2"
//               >
//                 Task Description
//               </label>
//               <textarea
//                 id="task-description"
//                 value={newTask.description}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, description: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//                 placeholder="Enter Task Description"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="due-date"
//                 className="block text-sm font-medium mb-2"
//               >
//                 Due Date
//               </label>
//               <input
//                 id="due-date"
//                 type="date"
//                 value={newTask.date}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, date: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="task-priority"
//                 className="block text-sm font-medium mb-2"
//               >
//                 Priority
//               </label>
//               <select
//                 id="task-priority"
//                 value={newTask.priority}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, priority: e.target.value })
//                 }
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//               >
//                 <option value="">Please select priority</option>
//                 <option value="low">Low Priority</option>
//                 <option value="medium">Medium Priority</option>
//                 <option value="high">High Priority</option>
//               </select>
//             </div>

//             {isEditing ? (
//               <div>
//                 <label
//                   htmlFor="task-progress"
//                   className="block text-sm font-medium mb-2"
//                 >
//                   Status
//                 </label>
//                 <select
//                   id="task-progress"
//                   value={newTask.status}
//                   onChange={(e) =>
//                     setNewTask({ ...newTask, status: e.target.value })
//                   }
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
//                 >
//                   <option value="">What's Your Progress</option>
//                   <option value="inProgress">In Process</option>
//                   <option value="completed">Completed</option>
//                   <option value="pending">Pending</option>
//                 </select>
//               </div>
//             ) : null}
//           </div>
//           <DialogFooter className="mt-4 flex justify-end space-x-2">
//             <button
//               onClick={() => {
//                 setIsDialogOpen(false);
//                 setIsEditing(false);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleSaveTask}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
//             >
//               {isEditing ? "Save Changes" : "Add Task"}
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default TaskManagement;







import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { HiDocumentAdd } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteForever, MdOutlineFileUpload } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

const TaskManagement = () => {
  const [documents, setDocuments] = useState([
    { id: Date.now(), docName: "", file: null },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lowTasks, setLowTasks] = useState([]);
  const [mediumTasks, setMediumTasks] = useState([]);
  const [highTasks, setHighTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    priority: "",
    status: "Pending",
  });
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const handleHover = (taskId) => setExpandedTaskId(taskId);
  const handleMouseLeave = () => setExpandedTaskId(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleAddTask = async () => {
    let token;
    try {
      token = JSON.parse(localStorage.getItem("cmstoken"));
    } catch (e) {
      toast.error("Invalid token format in local storage.");
      return;
    }
    if (!token) {
      toast.error("You are not logged in.");
      return;
    }
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.date ||
      !newTask.priority ||
      !newTask.cnrNumber
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Validate API URL
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error("API URL is not defined in environment variables.");
      toast.error("Server configuration is missing.");
      return;
    }

    try {
      const dueDate = new Date(newTask.date).toISOString();
      const formData = new FormData();
      formData.append("title", newTask.title.trim());
      formData.append("description", newTask.description.trim());
      formData.append("dueDate", dueDate);
      formData.append("priority", newTask.priority);
      formData.append("cnrNumber", newTask.cnrNumber.trim());
      formData.append("status", newTask.status || "pending");
      if (!Array.isArray(documents)) {
        toast.error("Invalid document data.");
        return;
      }
      console.log("sdfghjkl;",formData)
      documents.forEach((doc) => {
        if (doc.file) {
          formData.append("files", doc.file);
          formData.append("fileNames", doc.docName);
        }
      });
      await axios
        .post(`${apiUrl}/task/add-task`, formData, {
          headers: {
            token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success("Task added successfully.");
          fetchTasks();
          setNewTask({
            title: "",
            description: "",
            date: "",
            priority: "",
            status: "",
            cnrNumber: "",
          });
          setDocuments([{ id: Date.now(), docName: "", file: null }]);
          setIsDialogOpen(false);
          setExpandedTaskId(null);
          setIsEditing(false);
          setEditingTaskId(null);
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message || "An unexpected error occurred.";
          console.error(
            "Error adding task:",
            error.response?.data || error.message
          );
          toast.error(errorMessage);
        });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      console.error("Error adding task:", error.message);
      toast.error(errorMessage);
    }
  };

  const handleSaveTask = async () => {
    if (
      !newTask.title ||
      !newTask.description ||
      !newTask.date ||
      !newTask.priority ||
      (isEditing && !newTask.status)
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      if (isEditing) {
        await handleEditTask(editingTaskId, newTask);
      } else {
        await handleAddTask();
      }
    } catch (error) {
      toast.error("An error occurred while saving the task.");
    }
  };


  const fetchTasks = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to fetch tasks");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/task/get-alltask`, {
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
  useEffect(() => {
    fetchTasks();
  }, []);

  <button
    onClick={handleSaveTask}
    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
  >
    {isEditing ? "Save Changes" : "Add Task"}
  </button>;

  const openEditDialog = (task) => {
    setNewTask({
      ...task,
      date: new Date(task.dueDate).toISOString().split("T")[0],
    });
    setEditingTaskId(task._id);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setNewTask({
        title: "",
        description: "",
        date: "",
        priority: "",
        status: "",
        cnrNumber: "",
      });
      setEditingTaskId(null);
      setIsEditing(false);
      setDocuments([{ id: Date.now(), docName: "", file: null }]);
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

  const handleEditTask = async (taskId, updatedTask) => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to edit tasks");
      return;
    }
    if (!taskId || !updatedTask) {
      toast.error("Invalid task ID or updated task data");
      return;
    }
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/task/edit-task/${taskId}`,
        updatedTask,
        {
          headers: { token },
        }
      )
      .then((response) => {
        toast.success("Task updated successfully.");
        fetchTasks();
        setIsDialogOpen(false);
        setExpandedTaskId(null);
        setIsEditing(false);
        setEditingTaskId(null);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to update task. Please try again.";
        console.error(
          "Error updating task:",
          error.response?.data || error.message
        );
        toast.error(errorMessage);
        setIsDialogOpen(false);
        setExpandedTaskId(null);
        setIsEditing(false);
        setEditingTaskId(null);
      });
  };

  const handleDeleteTask = async (taskId) => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to edit tasks");
      return;
    }
    if (!taskId) {
      toast.error("Invalid task ID or updated task data");
      return;
    }
    axios
      .delete(`${import.meta.env.VITE_API_URL}/task/delete-task/${taskId}`, {
        headers: { token },
      })
      .then((response) => {
        toast.success("Task deleted successfully.");
        fetchTasks();
        setExpandedTaskId(null);
        setIsEditing(false);
        setEditingTaskId(null);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to update task. Please try again.";
        console.error(
          "Error updating task:",
          error.response?.data || error.message
        );
        toast.error(errorMessage);
        setExpandedTaskId(null);
        setIsEditing(false);
        setEditingTaskId(null);
      });
  };


  
    const [emails, setEmails] = useState([{ id: Date.now(), email: "" }]);
  
    const handleEmailChange = (id, value) => {
      const updatedEmails = emails.map((item) =>
        item.id === id ? { ...item, email: value } : item
      );
      setEmails(updatedEmails);
    };
  
    const handleAddEmailField = () => {
      setEmails([...emails, { id: Date.now(), email: "" }]);
    };
  
    const handleRemoveEmailField = (id) => {
      const updatedEmails = emails.filter((item) => item.id !== id);
      setEmails(updatedEmails);
    };
  

  return (
    <div className="relative">
      <div className="shadow-xl rounded-xl p-8 bg-white">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-[#5a518c] to-[#7b6cd2] text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-[#3d3f73] hover:to-[#6e5ecc] transition duration-300"
          >
            <HiDocumentAdd className="mr-2 text-xl" />
            <span className="text-lg font-semibold">Add Task</span>
          </button>
        </div>

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

              <ul className="space-y-4 rounded-lg p-2">
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
                         

                          {/* Display Attachments as "View Doc" with download trigger */}
                          {task.attachments && task.attachments.length > 0 && (
                           <div className="mt-3">
                           <strong className="block text-sm text-gray-700">Files:</strong>
                           {task.attachments.map((file, index) => (
                             <div key={index} className="mt-1 flex gap-[10px] ">
                               <span className="text-sm text-gray-800">{file.name}:-</span> {/* Display the name */}
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

                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditDialog(task)}
                            className="rounded-full p-2 text-gray-800 hover:bg-yellow-200 hover:text-gray-800 transition-all duration-200"
                          >
                            <FaRegEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="rounded-full p-2 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-200"
                          >
                            <MdDeleteForever className="h-5 w-5" />
                          </button>
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

        {/* <PendingTask/> */}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-purple-900">
              {isEditing ? "Edit Task" : "Add Task"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          <div className="space-y-3 p-4">
            <div>
              <label
                htmlFor="add-cnr"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                CNR Number
              </label>
              <input
                id="add-cnr"
                type="text"
                value={newTask.cnrNumber}
                onChange={(e) =>
                  setNewTask({ ...newTask, cnrNumber: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                placeholder="Enter Your CNR Number"
              />
            </div>

            {!isEditing
              ? documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Document Name
                        </label>
                        <input
                          type="text"
                          value={doc.docName}
                          onChange={(e) =>
                            handleChange(doc.id, "docName", e.target.value)
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                          placeholder="Enter Document Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Upload File
                        </label>
                        <div className="relative">
                          <label className="flex items-center justify-center w-full p-3 border-2 border-dashed rounded-lg cursor-pointer hover:border-purple-500 transition-colors bg-white shadow-sm">
                            <input
                              type="file"
                              onChange={(e) =>
                                handleChange(doc.id, "file", e.target.files[0])
                              }
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                            />
                            <div className="flex items-center space-x-2 text-gray-500">
                              <MdOutlineFileUpload className="text-2xl" />
                              <span className="text-sm truncate w-32">
                                {doc.fileName || "Choose file"}
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {doc.error && (
                      <Alert variant="destructive">
                        <AlertDescription className="text-sm text-red-600">
                          {doc.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {documents.length > 1 && (
                      <button
                        onClick={() => handleRemoveFields(doc.id)}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove Document
                      </button>
                    )}
                  </div>
                ))
              : null}

            {!isEditing ? (
              <button
                onClick={handleAddFields}
                className="w-full py-3 border-2 border-dashed rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                + Add Another Document
              </button>
            ) : null}

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
  {emails.map((emailField, index) => (
    <div key={emailField.id} className="mb-4">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        Email {index + 1}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="email"
          value={emailField.email}
          onChange={(e) => handleEmailChange(emailField.id, e.target.value)}
          className="w-full p-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Add email"
        />
        {emails.length > 1 && (
          <button
            onClick={() => handleRemoveEmailField(emailField.id)}
            className="text-sm  font-medium"
          >
            ❌
          </button>
        )}
        {/* Add button will only show for the last email field */}
        {index === emails.length - 1 && (
          <button
            onClick={handleAddEmailField}
            className="text-lg  font-medium"
          >
            ➕
          </button>
        )}
      </div>
    </div>
  ))}
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

            {isEditing ? (
              <div>
                <label
                  htmlFor="task-progress"
                  className="block text-sm font-medium mb-2"
                >
                  Status
                </label>
                <select
                  id="task-progress"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                >
                  <option value="">What's Your Progress</option>
                  <option value="inProgress">In Process</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            ) : null}
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
