



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Server } from 'lucide-react';

const UserDirectory = () => {
  const [users, setUsers] = useState([]);  // State to store fetched users data

  const fetchUsersData = () => {
    let token = JSON.parse(localStorage.getItem("cmstoken"));
    axios
      .get(`${import.meta.env.VITE_API_URL}/external-user/get-external-user`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setUsers(res.data.data);  // Set users data to state
        console.log(res.data.data);  // Log the data for debugging
      })
      .catch((error) => {
        toast.error("Error fetching data");
      });
  };

  useEffect(() => {
    fetchUsersData();  // Call the function when the component mounts
  }, []);

  return (
    <div className="w-full p-4" style={{ height: '480px' }}>
      <div className="bg-white rounded-lg p-6 shadow-lg h-full">
        <h1 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
          User Directory
        </h1>

        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-green-100 text-green-700">
                <th className="border border-green-300 px-2 py-1 text-left">
                  User Name
                </th>
                <th className="border border-green-300 px-2 py-1 text-left">
                  No. of Assigned Cases
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border border-green-200 px-2 py-1">
                    {user.name}
                  </td>
                  <td className="border border-green-200 px-2 py-1">
                    {user.noOfAssigncases}
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
