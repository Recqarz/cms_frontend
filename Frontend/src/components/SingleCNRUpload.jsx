import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { dataRefresher } from "../global/actions";
import { useDispatch } from "react-redux";

const SingleCNRUpload = () => {
  const [cnrNumber, setCnrNumber] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const userId = localStorage.getItem("userId");
  let dispatch = useDispatch()

  const handleSingleCnrUpload = async (cnrNumber) => {
    setIsLoading(true);
    try {
      const singleCnrUpload = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-cnr-numbers`,
        { cnrNumbers: [cnrNumber], userID: userId }
      );

      console.log("singleCnrUpload:", singleCnrUpload);

      // Success Message
      if (singleCnrUpload.data?.status) {
        toast.success(singleCnrUpload.data.message);
        setCnrNumber(""); // Clear the input field after success
        dispatch(dataRefresher())
      }
    } catch (err) {
      console.log("err while single cnr upload:", err);
      toast.error(`${err?.response?.data?.error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCnrUpload = async (e) => {
    e.preventDefault();

    if (!cnrNumber.length > 15) {
      return toast.error("Please Enter a Valid CNR Number!");
    }
    await handleSingleCnrUpload(cnrNumber);
    setCnrNumber(""); // Clear the input field even if validation fails
  };

  return (
    <div>
      <form onSubmit={handleCnrUpload} className="flex justify-center gap-2 ">
        <input
          required
          placeholder="Enter a valid CNR Number for upload"
          type="text"
          value={cnrNumber}
          onChange={(e) => setCnrNumber(e.target.value)}
          className="p-3 rounded-md outline-none border-[1px] border-gray-300 "
        />
        <button
          disabled={isLoading}
          onClick={handleCnrUpload}
          className={`px-4 py-2 text-white font-semibold rounded-lg ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default SingleCNRUpload;
