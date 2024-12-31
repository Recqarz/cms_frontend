import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
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
import { Label } from "../ui/label";
import toast from "react-hot-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaFileUpload } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa6";
import { Input } from "../ui/input";

const FilterData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectUser, setSelectUser] = useState({});
  const [users, setUsers] = useState([]);
  let role = JSON.parse(localStorage.getItem("cmsrole"));
  const [file, setFile] = useState(null);
  const [isSingle, setIsSingle] = useState(true);
  const [isSecOpen, setIsSecOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nusers, setNusers] = useState([
    { name: "", email: "", mobile: "", dayBeforeNotification: "" },
  ]);

  const handleSelectionChange = (value) => {
    setSelectUser(value);
  };
  const handleAddClick = () => {
    if (searchQuery.length !== 16) {
      toast.error("Please enter a valid 16-digit CNR");
      return;
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectUser({});
    }
  }, [isOpen]);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
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
    if (!selectUser || Object.keys(selectUser).length === 0) {
      toast.error("Please select a user");
      return;
    }
    if (!token) {
      toast.error("Please login again to add CNR");
      return;
    }
    if (isSingle) {
      setLoading(true);
      const newusers = nusers
        .filter((ele) => ele.email && ele.phone && ele.name)
        .map((ele) => ({
          name: ele?.name,
          email: ele?.email,
          mobile: ele?.mobile,
          dayBeforeNotification: Math.min(
            parseInt(ele?.dayBeforeNotification) || 4,
            4
          ),
        }));
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/cnr/addnew-singlecnr`,
          {
            cnrNumber: searchQuery,
            externalUserId: selectUser._id,
            externalUserName: selectUser.name,
            jointUser: newusers,
          },
          {
            headers: {
              token: token,
            },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsOpen(false);
          setNusers([
            { name: "", email: "", mobile: "", dayBeforeNotification: "" },
          ]);
          setIsSecOpen(false);
          fetchData();
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
          setLoading(false);
        });
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("externalUserId", selectUser._id);
      formData.append("externalUserName", selectUser.name);
      formData.append("excelFile", file);
      axios
        .post(`${import.meta.env.VITE_API_URL}/cnr/addnew-bulkcnr`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsOpen(false);
          setIsSingle(true);
          setFile(null);
          setIsSecOpen(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
          setLoading(false);
        });
    }
  }

  function handleAddCnrtype() {
    if (!selectUser || Object.keys(selectUser).length === 0) {
      toast.error("Please select a user");
      return;
    }
    if (isSingle) {
      setIsSecOpen(true);
    } else {
      handleAddCnr();
    }
  }

  useEffect(() => {
    if (!isSecOpen) {
      setNusers([
        { name: "", email: "", mobile: "", dayBeforeNotification: "" },
      ]);
    }
  }, [isSecOpen]);

  // Handler to add a new user input field
  const handleAddUser = () => {
    if (nusers.length < 8) {
      setNusers([...nusers, { name: "", email: "", mobile: "" }]);
    }
  };

  // Handler to remove the last user input field
  const handleRemoveUser = () => {
    if (nusers.length > 1) {
      setNusers(nusers.slice(0, -1));
    }
  };

  // Handler to update a specific user's input
  const handleInputChange = (index, field, value) => {
    const updatedUsers = [...nusers];
    updatedUsers[index][field] = value;
    setNusers(updatedUsers);
  };

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

  function handleFileUpload(e) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    setIsSingle(false);
    setIsOpen(true);
  }

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
          <div className="flex items-center justify-center w-full bg-gray-100 p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-sm hover:border-[#8B83BA] transition">
            <label
              htmlFor="file-upload"
              className="flex items-center space-x-2 text-gray-600 cursor-pointer"
            >
              <FaFileUpload className="text-xl" />
              <span>Upload a file</span>
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {file && (
            <div className="mt-4 text-gray-700">
              <p>Uploaded File: {file.name}</p>
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-center space-x-4">
            <button
              type="submit"
              onClick={handleFileUpload}
              className={`flex w-full items-center justify-center p-4  text-white rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 ${
                file ? "bg-[#5a518c]" : "bg-[#8B83BA]"
              }`}
            >
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
                <td className="px-6 py-3 border-b">
                  {data?.[0]?.cnrNumber ?? "N/A"}
                </td>
                <td className="px-6 py-3 border-b">
                  {data?.[0]?.caseStatus?.[0]?.[1] ?? "N/A"}
                </td>

                <td className="px-6 py-3 border-b">
                  {data?.[0]?.petitionerAndAdvocate?.[0]
                    ? (typeof data?.[0]?.petitionerAndAdvocate?.[0] === "string"
                        ? data?.[0]?.petitionerAndAdvocate?.[0]
                        : data?.[0]?.petitionerAndAdvocate[0]?.[0]
                      )?.replace(/^1\)\s*/, "")
                    : "N/A"}
                </td>
                <td className="px-6 py-3 border-b">
                  {data?.[0]?.respondentAndAdvocate?.[0]
                    ? (typeof data?.[0]?.respondentAndAdvocate?.[0] === "string"
                        ? data?.[0]?.respondentAndAdvocate?.[0]
                        : data?.[0]?.respondentAndAdvocate[0]?.[0]
                      )
                        ?.replace(/\d+\)\s*/g, "")
                        .replace(/\n/g, " , ")
                    : "N/A"}
                </td>

                <td className="px-6 py-3 border-b">
                  <button
                    onClick={() => {
                      setIsSingle(true);
                      handleAddClick();
                    }}
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
                onClick={() => {
                  setIsSingle(true);
                  handleAddClick();
                }}
                className={`mt-2 sm:mt-0 sm:ml-2 p-3 text-white rounded-lg w-full sm:w-auto ${
                  searchQuery.length !== 16 ? "bg-blue-400" : "bg-blue-600"
                }`}
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
              <Button
                onClick={() => {
                  handleAddCnrtype();
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Add"}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSecOpen} onOpenChange={setIsSecOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-hidden">
          <DialogHeader className="space-y-2">
            <DialogTitle>Notification Setting</DialogTitle>
            <DialogDescription className="text-red-500">
              You can add up to 8 users for notifications by providing their
              name, email, and phone number.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 py-4 px-1 overflow-y-auto max-h-[50vh] scrollbar-hide">
            {nusers.map((user, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 pb-4 border-b border-gray-200"
              >
                <h3 className="text-center font-medium">User {index + 1}</h3>

                <div className="grid grid-cols-4 items-center gap-3">
                  <Label
                    htmlFor={`name-${index}`}
                    className="text-right text-sm"
                  >
                    Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    className="col-span-3"
                    placeholder="Eg:- CMS"
                    value={user.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-3">
                  <Label
                    htmlFor={`email-${index}`}
                    className="text-right text-sm"
                  >
                    Email
                  </Label>
                  <Input
                    id={`email-${index}`}
                    className="col-span-3"
                    placeholder="Eg:- cms@recqarz.com"
                    value={user.email}
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-3">
                  <Label
                    htmlFor={`mobile-${index}`}
                    className="text-right text-sm"
                  >
                    Mobile
                  </Label>
                  <Input
                    id={`mobile-${index}`}
                    className="col-span-3"
                    placeholder="Eg:- 9876543211"
                    value={user.mobile}
                    onChange={(e) =>
                      handleInputChange(index, "mobile", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-3">
                  <Label
                    htmlFor={`dayBeforeNotification-${index}`}
                    className="text-right text-sm"
                  >
                    Day Before Notification
                  </Label>
                  <Input
                    id={`dayBeforeNotification-${index}`}
                    className="col-span-3"
                    placeholder="Max 4 days allowed"
                    value={user.dayBeforeNotification}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "dayBeforeNotification",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                onClick={handleAddUser}
                disabled={nusers.length >= 8}
                variant="secondary"
                size="sm"
              >
                + Add
              </Button>
              <Button
                onClick={handleRemoveUser}
                disabled={nusers.length <= 1}
                variant="secondary"
                size="sm"
              >
                - Remove
              </Button>
            </div>

            <Button
              onClick={handleAddCnr}
              type="submit"
              size="sm"
              disabled={loading}
            >
              {loading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterData;
