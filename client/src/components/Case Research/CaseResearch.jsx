import React, { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { FaDownload } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const CaseResearch = () => {
  const [courtType, setCourtType] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Reset the filters
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCourtType(""); // Reset the court type
  };

  return (
    <div className="relative mt-2">
      <div
        className={`shadow-lg rounded-xl p-8 bg-white ${
          isDialogOpen ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-3xl text-center text-[#6E6893] font-bold mb-8">
          All Case Research
        </h2>

        <div className="flex flex-wrap gap-6 justify-between items-center mb-8">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-lg font-medium text-[#6E6893]">DOF:</label>
            <div className="relative w-full sm:w-auto">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                placeholderText="Select Date Range"
                className="border border-[#6E6893] rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[#6E6893] pl-10"
              />
              <CiCalendar
                size={24}
                className="absolute left-3 top-3 text-[#6E6893] cursor-pointer"
                onClick={() =>
                  document
                    .querySelector(".react-datepicker__input-container input")
                    .focus()
                }
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={courtType} // Bind courtType state to the value
              onChange={(e) => setCourtType(e.target.value)} // Update courtType state when the selection changes
              className="w-full sm:w-auto border border-[#8B83BA] bg-[#F4F2FF] text-[#8B83BA] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8B83BA]"
            >
              <option value="">Type of Court</option>
              <option value="supreme">Supreme Court</option>
              <option value="district">District Court</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-3 border border-[#8B83BA] bg-[#F4F2FF] text-[#8B83BA] rounded-lg hover:bg-[#8B83BA] hover:text-white transition"
          >
            <MdLockReset size={20} />
            Reset
          </button>

          <button
            onClick={() => setIsDialogOpen(true)}
            className="px-4 py-3 bg-[#8B83BA] text-white rounded-lg hover:bg-[#5a518c] transition duration-300"
          >
            Keywords
          </button>

          <button className="px-4 py-3 bg-[#8B83BA] text-white rounded-lg hover:bg-[#5a518c] transition duration-300 flex items-center gap-2">
            <FaDownload size={16} />
            Download
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-[#F4F2FF] text-[#6E6893]">
              <tr>
                <th className="py-3 px-4 text-left">Case Number</th>
                <th className="py-3 px-4 text-left">Complainant</th>
                <th className="py-3 px-4 text-left">Respondent</th>
                <th className="py-3 px-4 text-left">Court</th>
                <th className="py-3 px-4 text-left">DOF</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white hover:bg-[#f3f2f7]">
                <td className="py-3 px-4">123456</td>
                <td className="py-3 px-4">John Doe</td>
                <td className="py-3 px-4">Jane Smith</td>
                <td className="py-3 px-4">Supreme Court</td>
                <td className="py-3 px-4">01-Jan-2023</td>
                <td className="py-3 px-4">Active</td>
                <td className="py-3 px-4 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">
                    Restore
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 ml-2 rounded-lg hover:bg-red-600 transition">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#5a518c]">Keywords</DialogTitle>
            <DialogDescription className="text">
              Enter keywords to filter case research.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              className="border border-[#8B83BA] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5a518c]"
              placeholder="Type keywords here..."
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-[#8B83BA] text-white rounded-lg hover:bg-[#5a518c]"
            >
              OK
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseResearch;
