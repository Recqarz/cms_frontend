import React, { useEffect, useState } from "react";
import { FiSearch, FiUpload, FiPlus } from "react-icons/fi";
import FileInput from "../FileInput";
import SearchInput from "../SearchInput";
import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FilterData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectUser, setSelectUser] = useState({});
  const [users, setUsers] = useState([]);
  let role = JSON.parse(localStorage.getItem("cmsrole"));

  const handleSelectionChange = (value) => {
    setSelectUser(value);
    console.log("Selected Value:", value);
  };
  const handleAddClick = () => {
    if (searchQuery.length !== 16) {
      toast.error("Please enter a valid 16-digit CNR");
      return;
    }
    setIsOpen(true);
  };

  function fetchData() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cnr/get-singlecnr/${searchQuery}`)
      .then((res) => {
        setData([res.data.data]);
      })
      .catch((error) => {
        setData([]);
        console.error("Error fetching data", error);
      });
  }

  function handleAddCnr() {
    let token = JSON.parse(localStorage.getItem("cmstoken"));
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/cnr/addnew-singlecnr`,
        {
          cnrNumber: searchQuery,
          externalUserId: selectUser._id,
          externalUserName: selectUser.name,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        toast.success("Case added successfully");
        setIsOpen(false);
        fetchData();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
      });
  }

  function fetchUsersData() {
    let token = JSON.parse(localStorage.getItem("cmstoken"));
    axios
      .get(`${import.meta.env.VITE_API_URL}/external-user/get-external-user`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setUsers(res.data.data);
        console.log(res.data.data);
      })
      .catch((error) => {
        toast.error("Error fetching data");
      });
  }

  useEffect(() => {
    fetchUsersData();
  }, []);

  useEffect(() => {
    if (searchQuery.length === 16) {
      fetchData();
    } else {
      setData([]);
    }
  }, [searchQuery]);

  return (
    <div className="mx-auto p-6 bg-white border border-gray-100 transition-all duration-300 max-w-full sm:max-w-4xl md:max-w-full">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Search case by cnr number
      </h2>
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-6">
        <div className="relative w-full">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="w-full">
          <FileInput />
        </div>
        <div className="w-full">
          <div className="flex items-center justify-center space-x-4">
            <button className="flex w-full items-center justify-center p-4 bg-green-500 text-white rounded-lg shadow-md cursor-pointer hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105">
              <FiUpload className="mr-2 text-xl" />
              <span className="text-lg font-semibold">Upload</span>
            </button>
          </div>
        </div>
      </form>
      <div className="mt-8 overflow-x-auto">
        {data.length > 0 ? (
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 border-b">CNR Number</th>
                <th className="px-6 py-3 border-b">First Hearing</th>
                <th className="px-6 py-3 border-b">Pet&Adv</th>
                <th className="px-6 py-3 border-b">Res&Adv</th>
                <th className="px-6 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-3 border-b">{data[0]?.cnrNumber}</td>
                <td className="px-6 py-3 border-b">
                  {data[0]?.caseStatus[0][1]}
                </td>
                <td className="px-6 py-3 border-b">
                  {data[0]?.petitionerAndAdvocate[0]}
                </td>
                <td className="px-6 py-3 border-b">
                  {data[0]?.respondentAndAdvocate[0]}
                </td>
                <td className="px-6 py-3 border-b">
                  <button
                    onClick={handleAddClick}
                    className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add+
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            <p>No matching CNR number found.</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
              <button
                onClick={handleAddClick}
                className="mt-2 sm:mt-0 sm:ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              >
                Add CNR Number
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Select {role == "advocate" ? "Client" : "Advocate"}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {users.length > 0 ? (
              <RadioGroup
                value={selectUser}
                onValueChange={handleSelectionChange}
              >
                {users.map((ele) => {
                  return (
                    <div key={ele._id} className="flex items-center space-x-2">
                      <RadioGroupItem value={ele} id={`r-${ele._id}`} />
                      <Label htmlFor={`r-${ele._id}`}>{ele.name}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
            ) : (
              `No ${
                role == "advocate" ? "Client" : "Advocate"
              } find. Please add at least one`
            )}
          </div>
          <DialogFooter>
            {users.length > 0 ? (
              <Button onClick={handleAddCnr} type="submit">
                Add
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterData;
