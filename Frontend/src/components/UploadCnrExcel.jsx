import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const UploadCnrExcel = () => {
    const [caseDetailsList, setCaseDetailsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");
  
    const handleFileUploadx = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        //   const cnrNumbers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        //   const cnrs = cnrNumbers.flat().filter(Boolean);

         // Parse rows into JSON with first row as headers
      const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      // Check if each row contains a 'cnr_row' (non-empty)
      const validRows = rows.filter((row, index) => {
        // Skip header (if index === 0) or rows without a valid CNR
        if (index === 0 || !row.includes('CNR_Numbers')) return false;
        return row[0]; // Adjust index based on column where `cnr_row` is expected
      });

      if (validRows.length === 0) {
        alert("No valid CNR rows found in the uploaded file!");
        return;
      }

      // Process the valid rows
      const cnrs = validRows.map(row => row[0]);
    console.log("cnrs:-----", cnrs)
        //   fetchCaseDetails(cnrs);
        };
        reader.readAsArrayBuffer(file);
      }
    };

  
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
          const cnrNumbers = rows.slice(1).map((row) => row[cnrIndex]).filter(Boolean);
      
          if (cnrNumbers.length === 0) {
            alert("No valid CNR numbers found in the uploaded file.");
            return;
          }
      
          // Proceed with valid CNR numbers
          console.log("Valid CNR Numbers:", cnrNumbers);
          fetchCaseDetails(cnrNumbers); // Replace this with your actual API call
        };
      
        reader.readAsArrayBuffer(file);
      }; 



  
    const fetchCaseDetails = async (cnrs) => {
      setLoading(true);
      setError(null);
  
      try {
        for (const cnr of cnrs) {
          try {
              const fetchCaseDetails = async (cnr, retries = 3) => {
                  let attempt = 0;
                  while(attempt < retries) {
                      const fallbackResponse = await axios.post(
                          `${import.meta.env.VITE_API_URL_CRAWLER}/crawler/caseDetails`,
                          { cnr_number: cnr,userID: userId}
                        ); 
                        console.log("Fallback API Response:", fallbackResponse.data);
                        const caseDetailData = fallbackResponse.data.savedData;
                        if(fallbackResponse.data.status !== false) {
                          return caseDetailData;
                        }
                        attempt++;
                        await new Promise((resolve) => setTimeout(resolve,10000))
                  }
                  return { status: false, links: ["No case details found for this CNR"] };
              }
              const caseDetailsData = await fetchCaseDetails(cnr)
              console.log("caseDetailsData:", caseDetailsData)
              setCaseDetailsList((prevList) => [...prevList, caseDetailsData]);
              console.log("caseDetailsList updated ?:", caseDetailsList)

            // setCaseDetailsList(results)
            // handleDownload();
          } catch (err) {
            console.error(`Error processing CNR: ${cnr}`, err);
          }
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while processing the request.");
      } finally {
        setLoading(false);
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

    return(
        <div>
            <span>Upload Excel</span>
            <div className="mb-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button disabled={loading} style={{marginBottom:"30px"}} className="ml-2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-md"
      onClick={downloadSampleExcel}
    >
    Sample Excel
    </button>
        </div>
    )
}

export default UploadCnrExcel;