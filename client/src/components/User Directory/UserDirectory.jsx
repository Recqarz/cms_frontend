import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const UserDirectory = () => {
  const [users, setUsers] = useState([]);

  const fetchUsersData = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    axios
      .get(`${import.meta.env.VITE_API_URL}/external-user/get-external-user`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setUsers(res.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching data");
      });
  };

  const handleDeleteUser = (_id, noOfAssigncases) => {
    console.log("Deleting user with ID:", _id);

    if (noOfAssigncases > 0) {
      toast.error("Cannot delete user with assigned cases.");
      return;
    }

    if (!_id) {
      toast.error("Invalid user ID. Please try again.");
      return;
    }

    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Unauthorized access. Please login again.");
      return;
    }

    axios
      .delete(
        `${
          import.meta.env.VITE_API_URL
        }/external-user/delete-external-user/${_id}`,
        {
          headers: {
            token: token,
          },
        }
      )
      .then((response) => {
        console.log("User deleted successfully:", response);
        toast.success("User deleted successfully.");
        fetchUsersData();
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again later.");
      });
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  return (
    <div className="w-full p-4" style={{ height: "480px" }}>
      <div className="bg-white rounded-lg p-6 shadow-lg h-full">
        <h1 className="text-center text-lg font-bold mb-4 py-2 bg-[#F4F2FF] text-[#8B83BA] rounded-lg">
          User Directory
        </h1>

        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#F4F2FF] text-[#5a518c]">
                <th className="border border-[#F4F2FF] px-2 py-1 text-left">
                  User Name
                </th>
                <th className="border border-[#F4F2FF] px-2 py-1 text-left">
                  No. of Assigned Cases
                </th>
                <th className="border border-[#F4F2FF] px-2 py-1 text-left">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-[#F4F2FF] px-2 py-1">
                    {user.name}
                  </td>

                  <td className="border border-[#F4F2FF] px-2 py-1">
                    {user.noOfAssigncases}
                  </td>

                  <td className="border border-[#F4F2FF] px-2 py-1 text-center">
                    <p className=" px-2 py-1 text-center">
                      <MdDelete
                        onClick={() =>
                          handleDeleteUser(user._id, user.noOfAssigncases)
                        }
                        className={`cursor-pointer ${
                          user.noOfAssigncases === 0
                            ? "text-red-500"
                            : "text-red-200"
                        }`}
                      />
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDirectory;
