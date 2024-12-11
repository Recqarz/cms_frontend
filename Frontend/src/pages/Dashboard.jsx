import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "./Modal";
import CnrDetailsTable from "../components/CnrDetailsTable";
import UploadCnrExcel from "../components/UploadCnrExcel";
import * as XLSX from "xlsx";
import SingleCNRUpload from "../components/SingleCNRUpload";

const Dashboard = () => {
  const [cnrNumber, setCnrNumber] = useState("");
  const [caseData, setCaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalCaseData, setModalCaseData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ccFields, setCcFields] = useState([]);
  const [originalCnrDetails, setOriginalCnrDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [filteredData, setFilteredData] = useState([]);

  // const [file, setFile] = useState(null);

  const closeModal = () => setIsModalOpen(false);

  // Fetch saved case details when component mounts
  useEffect(() => {
    // fetchSavedCaseDetails();
    getCnrDetails();
  }, []);

  // Fetch saved case details from the backend
  const fetchSavedCaseDetails = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/case/get-case-details/${userId}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setCaseData(data.data); // Update state with fetched data
        toast.success("Case details fetched successfully!");
      } else {
        toast.error(data.message || "Error fetching case details.");
      }
    } catch (error) {
      console.error("Error fetching saved case details:", error);
      toast.error("An error occurred while fetching the case details.");
    }
  };

  const getCnrDetails = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }
    // VITE_API_URL_CRAWLER
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/getCnrDetails/${userId}`
      );
      const data = await response.json();

      if (data.status == true) {
        setOriginalCnrDetails(data.cnrDetails);
        setFilteredData(data.cnrDetails);

        toast.success("Case details fetched successfully!");
      } else {
        toast.error(data.message || "Error fetching case details.");
      }
    } catch (error) {
      console.error("Error fetching saved case details:", error);
      toast.error("An error occurred while fetching the case details.");
    }
  };

  //   useEffect(() => {
  //     const savedFile = sessionStorage.getItem('uploadedFile');
  //     if (savedFile) {
  //         setFile(JSON.parse(savedFile));
  //     }
  // }, []);

  //   const handleFileChange = (e) => {
  //     const selectedFile = e.target.files[0];
  //     setFile(selectedFile);
  //     sessionStorage.setItem('uploadedFile', JSON.stringify(selectedFile));
  // };

  // const handleBulkUpload = async () => {
  //   if (!file) {
  //     toast.error("Please select a file.");
  //     return;
  //   }

  //   setIsLoading(true);

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/up/upload-bulk`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     if (response.ok && data.success) {
  //       toast.success(data.message || "Bulk upload successful!");
  //     } else {
  //       toast.error(data.message || "Error during upload.");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     toast.error("An error occurred while uploading the file.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Fetch case details based on CNR number

  const fetchCaseDetails = async () => {
    if (!cnrNumber) {
      toast.error("Please enter a CNR number.");
      return;
    }

    try {
      setIsLoading(true);

      let caseDetails;

      // Check if the case already exists in the local database
      const caseExistsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/check-cnr/${cnrNumber}`,
        { method: "GET" }
      );
      const caseExistsData = await caseExistsResponse.json();

      if (caseExistsData.success && caseExistsData.case) {
        caseDetails = transformCaseData(caseExistsData.case);
        toast.success("Case found in the local database!");
      } else {
        // If not found, fetch case details from the external API
        const externalResponse = await fetch(
          `${import.meta.env.VITE_EXTERNAL_API_URL}/getCase_Details_satus`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cnr_number: cnrNumber }),
          }
        );

        const externalData = await externalResponse.json();
        if (externalResponse.ok && externalData["Case Details"]) {
          caseDetails = transformCaseDataFromExternal(externalData);
          toast.success("Case details fetched");
        } else {
          toast.error("No case details found for this CNR.");
          return;
        }
      }

      // Save the case details to the local database
      const saveResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/save-to-database-a`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cnrNumber, caseDetails }),
        }
      );

      const saveData = await saveResponse.json();
      if (saveData.success) {
        toast.success("Case details saved to the local database!");
      } else {
        // toast.error(saveData.message || "Error saving case details.");
      }

      setModalCaseData(caseDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching case details:", error);
      toast.error("An error occurred while fetching case details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Transform case data from the external API response
  const transformCaseDataFromExternal = (data) => {
    const caseDetails = data["Case Details"] || {};
    return {
      cnrNumber: caseDetails["CNR Number"]?.split(" (")[0] || "N/A", // Clean up the CNR number
      caseType: caseDetails["Case Type"] || "N/A",
      filingDate: caseDetails["Filing Date"] || "N/A",
      filingNumber: caseDetails["Filing Number"] || "N/A",
      registrationDate: caseDetails["Registration Date"] || "N/A",
      registrationNumber: caseDetails["Registration Number"] || "N/A",
      acts:
        (data["Acts"] || []).map((act) => act.join(", ")).join("; ") || "N/A",
      caseStatus: data["Case Status"] || "N/A",
      caseHistory: data["Case History"] || "N/A",
      firDetails: data["FIR Details"] || {},
      petitionerAndAdvocate: (Array.isArray(data["Petitioner and Advocate"]) &&
      data["Petitioner and Advocate"].length > 0
        ? data["Petitioner and Advocate"].map((item) =>
            item.replace(/\n/g, " ")
          )
        : ["N/A"]
      ).join(", "),
      respondentAndAdvocate: (Array.isArray(data["Respondent and Advocate"]) &&
      data["Respondent and Advocate"].length > 0
        ? data["Respondent and Advocate"].map((item) =>
            item.replace(/\n/g, " ")
          )
        : ["N/A"]
      ).join(", "),
    };
  };

  // Transform case data from the local database response
  const transformCaseData = (data) => {
    const caseDetails = data.caseDetails || {};

    // Helper function to handle array of objects and extract required fields
    const extractAdvocateNames = (advocateArray) => {
      if (Array.isArray(advocateArray)) {
        return advocateArray
          .map((item) => item.name || "Unknown Advocate")
          .join(", ");
      }
      return "No advocates listed.";
    };

    return {
      cnrNumber: caseDetails.cnrNumber || "N/A",
      caseType: caseDetails.caseType || "N/A",
      filingDate: caseDetails.filingDate || "N/A",
      filingNumber: caseDetails.filingNumber || "N/A",
      registrationDate: caseDetails.registrationDate || "N/A",
      registrationNumber: caseDetails.registrationNumber || "N/A",
      acts: Array.isArray(caseDetails.acts)
        ? caseDetails.acts.join(", ")
        : typeof caseDetails.acts === "string"
        ? caseDetails.acts.split(", ")
        : "N/A",
      caseStatus: caseDetails.caseStatus || "N/A",
      caseHistory: caseDetails.caseHistory || "N/A",
      firDetails: caseDetails.firDetails || {},
      petitionerAndAdvocate: (Array.isArray(data["Petitioner and Advocate"]) &&
      data["Petitioner and Advocate"].length > 0
        ? data["Petitioner and Advocate"].map((item) =>
            item.replace(/\n/g, " ")
          )
        : ["N/A"]
      ).join(", "),
      respondentAndAdvocate: (Array.isArray(data["Respondent and Advocate"]) &&
      data["Respondent and Advocate"].length > 0
        ? data["Respondent and Advocate"].map((item) =>
            item.replace(/\n/g, " ")
          )
        : ["N/A"]
      ).join(", "),
    };
  };

  // Save the CNR number for the user
  const handleSaveCnr = async () => {
    if (!cnrNumber) {
      toast.error("Please enter a CNR number.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    try {
      setIsLoading(true);

      const caseData = {
        cnr_number: cnrNumber,
        userId,
        ccEmails: ccFields, // Use the state from here
      };

      const saveResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/case/save-case/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(caseData),
        }
      );

      const saveData = await saveResponse.json();
      if (saveData.success) {
        toast.success("CNR number saved successfully!");
        fetchSavedCaseDetails();
      } else {
        toast.error(saveData.message || "Error saving CNR.");
      }
    } catch (error) {
      console.error("Error saving CNR:", error);
      toast.error("Error saving CNR. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = originalCnrDetails.filter((item) =>
      item.cnrNumber.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  console.log("filteredData:", filteredData);

  return (
    <div
      className="p-2 max-w-[1050px] bg-[#FFFFFF] "
      style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}
    >
      {/* Search and Add CNR */}
      <div className=" flex items-center gap-10  justify-end h-[80px] ">
        <div className="flex items-center  justify-center p-3 w-[250px] h-12 border   rounded-md   outline-none  cursor-pointer transition duration-200">
          <input
            type="text"
            // value={cnrNumber}
            // onChange={(e) => setCnrNumber(e.target.value.toUpperCase())}

            value={searchTerm}
            onChange={handleSearch}
            className="flex-grow p-2 rounded-md focus:outline-none "
            placeholder="Search CNR Number..."
          />
          {/* <button
          onClick={fetchCaseDetails}
          className="ml-2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-md"
        >
          Search CNR
        </button>

          {/* <div><GrUpload /></div> */}
        </div>
        <SingleCNRUpload />
        <UploadCnrExcel />
      </div>

      {/* <div className="mb-6">
      <input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="mb-3"
      />
      <button
        onClick={handleBulkUpload}
        disabled={isLoading}
        className="text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-md"
      >
        {isLoading ? "Uploading..." : "Upload Bulk CNR"}
      </button>
    </div> */}

      {/* Loading and Case Table */}
      {isLoading ? (
        <div className=" text-center text-lg font-semibold">Loading...</div>
      ) : (
        <div>
          <CnrDetailsTable
            // originalCnrDetails={originalCnrDetails}
            originalCnrDetails={searchTerm ? filteredData : originalCnrDetails}
          />
        </div>
      )}

      {/* Modal for Case Details */}
      {isModalOpen && modalCaseData && (
        <Modal
          caseData={modalCaseData}
          closeModal={closeModal}
          saveCase={handleSaveCnr} // Pass the save case function here
          setCcFields={setCcFields} // Pass the setter function here
        />
      )}
    </div>
  );
};

export default Dashboard;
