import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import Nodatafound from "../../assets/Images/Nodata_found.png";
import axios from "axios";
import Pagination from "../pagination/pagination";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const State = () => {
  const [courtType, setCourtType] = useState("");
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [stateData, setStateData] = useState([]);
  const [dummyData, setDummyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [tableData, setTableData] = useState([]);

  const totalPages = Math.ceil(tableData.length / pageLimit);
  const dropdownRef = useRef(null);

  const fetchKeyWordCnr = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      toast.error("Please login to access this feature.");
      return;
    }
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/keyword/get-new-keyword-cnr-state`,
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setTableData(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [currCnr, setCurrCnr] = useState({});
  const [users, setUsers] = useState([]);
  const role = JSON.parse(localStorage.getItem("cmsrole"));

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

  const [loading, setLoading] = useState(false);
  const [isSecOpen, setIsSecOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [nusers, setNusers] = useState([
    { name: "", email: "", mobile: "", dayBeforeNotification: "" },
  ]);

  useEffect(() => {
    if (!isSecOpen || !isOpen) {
      setNusers([
        { name: "", email: "", mobile: "", dayBeforeNotification: "" },
      ]);
    }
  }, [isSecOpen, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectUser({});
    }
  }, [isOpen]);

  const handleAddUser = () => {
    if (nusers.length < 8) {
      setNusers([
        ...nusers,
        { name: "", email: "", mobile: "", dayBeforeNotification: "" },
      ]);
    }
  };

  const handleRemoveUser = () => {
    if (nusers.length > 1) {
      setNusers(nusers.slice(0, -1));
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedUsers = [...nusers];
    updatedUsers[index][field] = value;
    setNusers(updatedUsers);
  };

  const handleAddCnr = () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!selectUser || Object.keys(selectUser).length === 0) {
      toast.error("Please select a user");
      return;
    }
    if (!token) {
      toast.error("Please login again to add CNR");
      return;
    }
    setLoading(true);
    const newusers = nusers
      .filter((ele) => ele.email && ele.mobile && ele.name)
      .map((ele) => ({
        name: ele.name,
        email: ele.email,
        mobile: ele.mobile,
        dayBeforeNotification: Math.min(
          parseInt(ele.dayBeforeNotification) || 4,
          4
        ),
      }));
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/cnr/addnew-singlecnr`,
        {
          cnrNumber: currCnr.cnrNumber,
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
        setLoading(false);
        setIsSecOpen(false);
        setNusers([
          { name: "", email: "", mobile: "", dayBeforeNotification: "" },
        ]);
        setCurrCnr({});
        setSelectUser({});
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
        setLoading(false);
        setIsOpen(false);
        setIsSecOpen(false);
        setNusers([
          { name: "", email: "", mobile: "", dayBeforeNotification: "" },
        ]);
        setCurrCnr({});
        setSelectUser({});
      });
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const [selectUser, setSelectUser] = useState({});
  const handleSelectionChange = (value) => {
    setSelectUser(value);
  };

  useEffect(() => {
    fetchKeyWordCnr();
  }, []);

  const fetchStateData = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/state/get-state`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (!response.ok) {
        console.error("Error fetching states:", response.statusText);
        return;
      }

      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setStateData(responseData.data);
      } else {
        console.error("Unexpected data format for states:", responseData);
      }
    } catch (error) {
      console.error("Error fetching state data:", error);
    }
  };

  const fetchKeyword = async () => {
    const token = JSON.parse(localStorage.getItem("cmstoken"));
    if (!token) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/keyword/get-keyword`,
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );
      setDummyData(response.data.data);
    } catch (err) {
      console.error("Error fetching keywords:", err);
    }
  };

  useEffect(() => {
    fetchStateData();
    fetchKeyword();
  }, []);

  const handleSelect = (value) => {
    setSelectedValue(value);
    setQuery(value);
    setDropdownVisible(false);
  };

  const handleReset = () => {
    setCourtType("");
    setQuery("");
    setState("");
  };

  const handleSave = () => {
    if (!state || !courtType || !selectedValue) {
      toast.error("Please fill in all fields before saving.");
      return;
    }

    const selectedData = {
      state,
      courtType,
      keyword: selectedValue,
      isStatePremium: true,
    };

    try {
      const token = JSON.parse(localStorage.getItem("cmstoken"));

      if (!token) {
        console.error("Token not found");
        return;
      }
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/premium/createlocation`,
          selectedData,
          {
            headers: {
              token,
            },
          }
        )
        .then((res) => {
          toast.success("Added the Keyword");
          setState("");
          setCourtType("");
        })
        .catch((err) => {
          toast.error("Something went wrong");
        });
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred while saving the data. Please try again.");
    }

    console.log("Selected Data:", selectedData);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const filteredData = dummyData.filter((item) =>
    item?.keyword.toLowerCase().includes(query.toLowerCase())
  );

  const paginatedData = tableData.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  return (
    <div className="relative mt-2">
      <div className="flex flex-wrap justify-between items-center mb-3 p-3 bg-[#F4F2FF] shadow-lg border border-[#8B83BA]">
        <div className="flex gap-6">
          <div className="w-full sm:w-[200px]">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Select State</option>
              {stateData.map((stateItem) => (
                <option key={stateItem._id} value={stateItem.state}>
                  {stateItem.state}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-[200px]">
            <select
              value={courtType}
              onChange={(e) => setCourtType(e.target.value)}
              className="w-full border bg-white text-[#8B83BA] rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Type of Court</option>
              <option value="supremeCourt">Supreme Court</option>
              <option value="districtCourt">District Court</option>
            </select>
          </div>

          <div className="w-full sm:w-[300px] relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search your keyword here"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDropdownVisible(true);
              }}
              onFocus={() => setDropdownVisible(true)}
              className="w-full px-4 py-3 border bg-white text-[#8B83BA] rounded-lg focus:ring-2 focus:ring-[#8B83BA]"
            />
            {dropdownVisible && filteredData.length > 0 && (
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto scrollbar-hide">
                {filteredData.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => handleSelect(item?.keyword)}
                    className="px-4 py-2 cursor-pointer hover:bg-[#8B83BA] hover:text-white"
                  >
                    {item?.keyword}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-full sm:w-[150px]">
            <button
              onClick={handleSave}
              disabled={!state || !courtType || !selectedValue}
              className="w-full px-4 py-3 bg-[#8B83BA] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#5a518c] focus:ring-2 focus:ring-[#8B83BA] focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaDownload size={16} />
              Save
            </button>
          </div>

          <div className="w-full sm:w-[150px]">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-[#8B83BA] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#5a518c]"
            >
              <MdLockReset size={20} />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full border rounded-lg">
          <thead className="bg-[#F4F2FF] text-[#6E6893]">
            <tr>
              <th className="py-3 px-4 text-left">CNR Number</th>
              <th className="py-3 px-4 text-left">Registration Date</th>
              <th className="py-3 px-4 text-left">Petitioner</th>
              <th className="py-3 px-4 text-left">Respondent</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((ele, index) => (
                <tr
                  className="bg-white hover:bg-gray-100"
                  key={ele?._id || index}
                >
                  <td className="py-3 px-4">{ele?.cnrNumber}</td>
                  <td className="py-3 px-4">{ele?.registrationDate}</td>
                  <td className="py-3 px-4">{ele?.petitioner}</td>
                  <td className="py-3 px-4">{ele?.respondent}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setIsOpen(true);
                        setCurrCnr(ele);
                      }}
                      className="bg-blue-600 px-4 py-1 text-white rounded-md"
                    >
                      Add
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
                      alt="No cases found"
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Select {role === "advocate" ? "Client" : "Advocate"}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {users.length > 0 ? (
              <RadioGroup
                value={selectUser}
                onValueChange={handleSelectionChange}
              >
                {users.map((ele) => (
                  <div key={ele._id} className="flex items-center space-x-2">
                    <RadioGroupItem value={ele} id={`r-${ele._id}`} />
                    <Label htmlFor={`r-${ele._id}`}>{ele.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              `No ${
                role === "advocate" ? "Client" : "Advocate"
              } found. Please add at least one`
            )}
          </div>
          <DialogFooter>
            {users.length > 0 ? (
              <Button
                onClick={() => {
                  if (!selectUser || Object.keys(selectUser).length === 0) {
                    toast.error("Please select a user");
                    return;
                  }
                  setIsSecOpen(true);
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

export default State;
