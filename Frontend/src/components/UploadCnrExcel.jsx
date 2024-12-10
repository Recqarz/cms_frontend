import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const UploadCnrExcel = () => {
  const [caseDetailsList, setCaseDetailsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const [isCnrUploading, setIsCnrUploading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      alert("Please upload a valid Excel file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert the sheet into JSON with headers
      const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      if (rows.length === 0) {
        alert("The uploaded file is empty.");
        return;
      }

      // Check for 'CNR_Numbers' header
      const header = rows[0];
      const cnrIndex = header.indexOf("CNR_Numbers");

      if (cnrIndex === -1) {
        alert("The uploaded file does not contain a 'CNR_Numbers' column.");
        return;
      }

      // Extract CNR numbers and validate rows
      const cnrNumbers = rows
        .slice(1)
        .map((row) => row[cnrIndex])
        .filter(Boolean);

      if (cnrNumbers.length === 0) {
        alert("No valid CNR numbers found in the uploaded file.");
        return;
      }

      // Proceed with valid CNR numbers
      console.log("Valid CNR Numbers:", cnrNumbers);
      setPendingCount(cnrNumbers.length)
      handleUploadCnrNumbers(cnrNumbers)
      // fetchCaseDetails(cnrNumbers); // crawller
    };

    reader.readAsArrayBuffer(file);
  };

  // uploadCnrRoute
  const handleUploadCnrNumbers = async(cnrNumbers) => {
    try{
      setLoading(true)
      const storedCnrNumberApi = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-cnr-numbers`,
        { cnrNumbers: cnrNumbers, userID: userId }
      );

      console.log("storedCnrNumberApi----", storedCnrNumberApi)

    }catch(err){
      console.log("err:", err)
    }finally{
      setLoading(false)
    }
  }

  const fetchCaseDetails = async (cnrs) => {
    setLoading(true);
    setIsCnrUploading(true)
    setError(null);

    try {
      for (const cnr of cnrs) {
        try {
          const fetchCaseDetails = async (cnr, retries = 3) => {
            let attempt = 0;
            while (attempt < retries) {
              const fallbackResponse = await axios.post(
                `${import.meta.env.VITE_API_URL_CRAWLER}/crawler/caseDetails`,
                { cnr_number: cnr, userID: userId }
              );
              console.log("Fallback API Response:", fallbackResponse.data);
              const caseDetailData = fallbackResponse.data.savedData;
              if (fallbackResponse.data.status !== false) {
                return caseDetailData;
              }
              attempt++;
              await new Promise((resolve) => setTimeout(resolve, 10000));
            }
            return {
              status: false,
              links: ["No case details found for this CNR"],
            };
          };
          const caseDetailsData = await fetchCaseDetails(cnr);
          console.log("caseDetailsData:", caseDetailsData);
          setCaseDetailsList((prevList) => [...prevList, caseDetailsData]);
          console.log("caseDetailsList updated ?:", caseDetailsList);
          setPendingCount((prevCount) => prevCount - 1);
          // setCaseDetailsList(results)
        } catch (err) {
          console.error(`Error processing CNR: ${cnr}`, err);
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the request.");
    } finally {
      setLoading(false);
      setIsCnrUploading(false)
    }
  };

  const downloadSampleExcel = () => {
    // Sample data with 'cnr_row' and a valid CNR number
    const sampleData = [
      ["CNR_Numbers"], // Header row
      ["DLSY020504532024"], // Example CNR number
      ["DLSK020598532024"], // Example CNR number
    ];

    // Create a workbook and add a sheet
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");

    // Generate and download the file
    const fileName = "sample_cnr.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="flex flex-col items-start justify-between mb-3">
      <div className="flex items-center justify-center gap-4 mb-2">
        <span className="block text-[12px]">Upload bulk CNR Excel</span>
        <span
          disabled={loading}
          className="text-[12px] cursor-pointer underline"
          onClick={downloadSampleExcel}
        >
          Download Sample Excel
        </span>
      </div>
      <label className="flex items-center justify-center w-auto h-12 px-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition duration-200 p-1">
        <span className="text-gray-600">
          Drag and drop your file here or click to upload
        </span>
        <input
           disabled={isCnrUploading}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      <br />
      {isCnrUploading && (
        <div className="mb-4">
          <p>Processing CNRs: {pendingCount} remaining</p>
        </div>
      )}
    </div>
  );
};

export default UploadCnrExcel;
