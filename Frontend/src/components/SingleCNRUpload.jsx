import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const SingleCNRUpload = () => {
  const [cnrNumber, setCnrNumber] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const userId = localStorage.getItem("userId");

  const handleCnrUpload = async (e) => {
    e.preventDefault();

    if (!cnrNumber.length > 15) {
      return toast.error("Plase Enter a Valid CNR Number !");
    }
    await handleSingleCnrUpload(cnrNumber);
  };

  const handleSingleCnrUpload = async (cnrNumber) => {
    setIsLoading(true);
    try {
      const singleCnrUpload = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/crawler/caseDetails`,
        { cnr_number: cnrNumber, userID: userId }
      );

      console.log("singleCnrUpload:", singleCnrUpload);
    } catch (err) {
      console.log("err while single cnr upload:", err);
      toast.error(`${err?.response?.data?.error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleCnrUpload} className="flex justify-center gap-2">
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
          Upload
        </button>
      </form>
    </div>
  );
};

export default SingleCNRUpload;
