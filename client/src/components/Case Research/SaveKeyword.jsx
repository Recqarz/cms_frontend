import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../pagination/pagination";
import { MdOutlineDeleteSweep } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from ".././ui/dialog";
import Nodatafound from "../../assets/Images/Nodata_found.png";
import toast from "react-hot-toast";

const SaveKeyword = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const totalPages = 10;

  // Fetch keyword data
  const fetchKeyword = async () => {
    const token = localStorage.getItem("cmstoken")
      ? JSON.parse(localStorage.getItem("cmstoken"))
      : "";
    if (token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/premium/getall`,
          {
            headers: {
              token: token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("API Response:", response.data);
        setData(response.data.data);
      } catch (err) {
        console.error("Error fetching keywords:", err);
      }
    } else {
      console.warn("No token found in localStorage.");
    }
  };

  // Call fetchKeyword on component load
  useEffect(() => {
    fetchKeyword();
  }, []);

  // Handle delete icon click
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTask = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login again to edit tasks");
      return;
    }

    if (!itemToDelete) {
      toast.error("No item selected to delete");
      return;
    }

    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/premium/deletelocation/${
          itemToDelete._id
        }`,
        {
          headers: { token },
        }
      )
      .then((response) => {
        console.log(response);
        toast.success("Task deleted successfully.");
        fetchKeyword();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to delete task. Please try again.";
        console.error(
          "Error delete task:",
          error.response?.data || error.message
        );
        toast.error(errorMessage);
      });
  };

  return (
    <div className="relative mt-2">
      <div className="overflow-x-auto w-full">
        <table className="w-full border rounded-lg">
          <thead className="bg-[#F4F2FF] text-[#6E6893]">
            <tr>
              <th className="py-3 px-4 text-left">Country</th>
              <th className="py-3 px-4 text-left">State</th>
              <th className="py-3 px-4 text-left">District</th>
              <th className="py-3 px-4 text-left">Keyword</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4">{item.country || "N/A"}</td>
                  <td className="py-3 px-4">{item.state || "All State"}</td>
                  <td className="py-3 px-4">
                    {item.district || "All District"}
                  </td>
                  <td className="py-3 px-4">{item.keyword || "N/A"}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-red-500 hover:text-red-700 text-center text-[25px]"
                    >
                      <MdOutlineDeleteSweep />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-10 text-center">
                  <div className="flex flex-col items-center">
                    <img
                      src={Nodatafound}
                      alt="No data found"
                      className="max-w-xs mx-auto mb-4"
                    />
                    <p className="text-[#6E6893]">No cases found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={setPageLimit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-lg h-[200px] mx-auto text-center flex flex-col justify-between">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this item?
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex justify-center space-x-6 gap-[10px]">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleDeleteTask}
            >
              Yes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SaveKeyword;
