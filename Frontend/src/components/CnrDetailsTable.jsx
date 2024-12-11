import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { LiaFileExportSolid } from "react-icons/lia";
import { useSelector } from "react-redux";

const CnrDetailsTable = ({ originalCnrDetails }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  let searchData = useSelector((state) => state.searchData);
  const [data, setData] = useState([]);

  // Handle selection/deselection of a row
  const handleSelectRow = (cnrNumber) => {
    setSelectedRows((prev) => {
      if (prev.includes(cnrNumber)) {
        return prev.filter((num) => num !== cnrNumber); // Unselect
      } else {
        return [...prev, cnrNumber]; // Select
      }
    });
  };

  // Prepare data for the DataTable

  const ndata = originalCnrDetails.map((detail) => {
    const cnrNumber = detail.cnrDetails?.cnr_number || "Not Available";

    // Extract individual fields for the table
    const caseType =
      detail.cnrDetails["Case Details"]?.["Case Type"] || "Not Available";
    const filingNumber =
      detail.cnrDetails["Case Details"]?.["Filing Number"] || "Not Available";
    const filingDate =
      detail.cnrDetails["Case Details"]?.["Filing Date"] || "Not Available";
    const registrationNumber =
      detail.cnrDetails["Case Details"]?.["Registration Number"] ||
      "Not Available";
    const registrationDate =
      detail.cnrDetails["Case Details"]?.["Registration Date:"] ||
      "Not Available";

    const firstHearingDate =
      detail.cnrDetails["Case Status"]?.[0]?.[1] || "Not Available";
    const nextHearingDate =
      detail.cnrDetails["Case Status"]?.[1]?.[1] || "Not Available";
    const caseStage =
      detail.cnrDetails["Case Status"]?.[2]?.[1] || "Not Available";
    const courtAndJudge =
      detail.cnrDetails["Case Status"]?.[3]?.[1] || "Not Available";

    const petitionerAdvocate =
      detail.cnrDetails["Petitioner and Advocate"]?.[0]
        ?.split("\n")[1]
        ?.replace("Advocate-", "")
        ?.trim() || "Not Available";
    const respondentAndAdvocate =
      detail.cnrDetails["Respondent and Advocate"]?.[0] || "Not Available";

    const links = detail.cnrDetails["Links"]?.[0] || "Not Available";

    return {
      cnrNumber,
      caseType,
      filingNumber,
      filingDate,
      registrationNumber,
      registrationDate,
      firstHearingDate,
      nextHearingDate,
      caseStage,
      courtAndJudge,
      petitionerAdvocate,
      respondentAndAdvocate,
      links,
    };
  });


  function updateData() {
    let sdata = ndata.filter((ele) => {
      if (searchData == "") {
        return ele;
      } else {
        return Object.values(ele).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchData.toLowerCase())
        );
      }
    });
    setData(sdata);
  }

  useEffect(() => {
    updateData();
  }, [searchData,originalCnrDetails]);

  console.log("table data:", data);

  // Toggle select/unselect for all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(originalCnrDetails.map((row) => row.cnrNumber)); // Select all
    }
  };

  const handleDownload = () => {
    let filterCaseData = originalCnrDetails.filter((item) =>
      selectedRows.includes(item.cnrNumber)
    );
    console.log("caseDetailsList filtered :::", filterCaseData);
    if (!filterCaseData.length) {
      return toast.error("Please select CNR Number !");
    }
    // if (!filterCaseData.length) return;

    const wb = XLSX.utils.book_new();
    const sheetData = [
      [
        "CNR Number",
        "Case Type",
        "Filing Date",
        "Filing Number",
        "Registration Date",
        "Registration Number",
        "Acts",
        "Petitioner and Advocate",
        "Respondent and Advocate",
        "Order Links",
      ],
    ];

    filterCaseData.forEach((caseDetails) => {
      const {
        cnr_number: cnrNumber, // Use actual key from the object
        "Case Details": caseDetailsObj, // Extract nested object
        Acts: acts,
        "Petitioner and Advocate": petitionerAndAdvocate,
        "Respondent and Advocate": respondentAndAdvocate,
        Links,
      } = caseDetails.cnrDetails;

      // Extract details from `caseDetailsObj`
      const {
        "Case Type": caseType,
        "Filing Date": filingDate,
        "Filing Number": filingNumber,
        "Registration Date:": registrationDate,
        "Registration Number": registrationNumber,
      } = caseDetailsObj || {};

      // Format Acts for Excel
      const formattedActs = acts
        ? acts.map((act) => act.join(" - ")).join("; ")
        : "Not Available";

      // Format petitioner and respondent details for Excel
      const formattedPetitioners = petitionerAndAdvocate
        ? petitionerAndAdvocate.join(" | ")
        : "Not Available";
      const formattedRespondents = respondentAndAdvocate
        ? respondentAndAdvocate.join(" | ")
        : "Not Available";

      const dataRow = [
        cnrNumber || "Not Available",
        caseType || "Not Available",
        filingDate || "Not Available",
        filingNumber || "Not Available",
        registrationDate || "Not Available",
        registrationNumber || "Not Available",
        formattedActs,
        formattedPetitioners,
        formattedRespondents,
        "",
      ];

      sheetData.push(dataRow);

      Links?.forEach((link, index) => {
        sheetData.push([
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          {
            t: "s", // Type string
            l: { Target: link }, // Link metadata
            v: `Order ${index + 1} : ${link} `,
          },
        ]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths after `ws` is created
    const colWidths = [
      { wch: 30 }, // CNR Number
      { wch: 25 }, // Case Type
      { wch: 15 }, // Filing Date
      { wch: 15 }, // Filing Number
      { wch: 20 }, // Registration Date
      { wch: 20 }, // Registration Number
      { wch: 40 }, // Acts
      { wch: 40 }, // Petitioners and Advocates
      { wch: 60 }, // Respondents and Advocates
      { wch: 60 }, // Order Links
    ];
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Case Details");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Consolidated_Case_Details.xlsx";
    link.click();
  };

  console.log("selectedRows:", selectedRows);

  // Define columns for the DataTable

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={selectedRows.length === originalCnrDetails.length}
          onChange={toggleSelectAll}
          className="cursor-pointer"
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.cnrNumber)}
          onChange={() => handleSelectRow(row.cnrNumber)}
          className="cursor-pointer"
        />
      ),
      width: "50px",
    },
    { name: "CNR Number", selector: (row) => row.cnrNumber, sortable: true },
    { name: "Case Type", selector: (row) => row.caseType, sortable: true },
    {
      name: "Filing Number",
      selector: (row) => row.filingNumber,
      sortable: true,
    },
    { name: "Filing Date", selector: (row) => row.filingDate, sortable: true },
    {
      name: "Registration Number",
      selector: (row) => row.registrationNumber,
      sortable: true,
    },
    {
      name: "Registration Date",
      selector: (row) => row.registrationDate,
      sortable: true,
    },
    {
      name: "First Hearing Date",
      selector: (row) => row.firstHearingDate,
      sortable: true,
    },
    {
      name: "Next Hearing Date",
      selector: (row) => row.nextHearingDate,
      sortable: true,
    },
    { name: "Case Stage", selector: (row) => row.caseStage, sortable: true },
    {
      name: "Court & Judge",
      selector: (row) => row.courtAndJudge,
      sortable: true,
    },
    {
      name: "Petitioner Advocate",
      selector: (row) => row.petitionerAdvocate,
      sortable: true,
    },
    {
      name: "Respondent Advocate",
      selector: (row) => row.respondentAndAdvocate,
      sortable: true,
    },
    {
      name: "Order Links",
      cell: (row) => (
        <a
          href={row.links}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View Document
        </a>
      ),
    },
  ];

  return (
    <div className="">
      <div className="flex">
        <button
          onClick={handleDownload}
          disabled={data.length === 0}
          className={`px-3 py-2 m-[5px] text-white font-semibold rounded-lg flex items-center ${
            !data.length
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {" "}
          Export
          <LiaFileExportSolid className="ml-2" /> {/* Margin for spacing */}
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive
        customStyles={{
          rows: {
            style: {
              minHeight: "72px", // Override the row height
              backgroundColor: "#f8f9fa", // Light gray background for rows
            },
          },
          headCells: {
            style: {
              fontWeight: "bold",
              fontSize: "16px",
              backgroundColor: "#e9ecef", // Slightly darker gray for header
            },
          },
          table: {
            style: {
              backgroundColor: "#f8f9fa", // Light gray background for the entire table
            },
          },
        }}
      />
    </div>
  );
};

export default CnrDetailsTable;
