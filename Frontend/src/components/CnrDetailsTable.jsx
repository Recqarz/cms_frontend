import React, { useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

const CnrDetailsTable = ({ originalCnrDetails }) => {
    const [selectedRows, setSelectedRows] = useState([]);

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
  const data = originalCnrDetails.map((detail) => {
    const caseStatus = detail.cnrDetails["Case Status"];
    const caseDetails = detail.cnrDetails["Case Details"]
    const firstHearingDate = caseStatus?.find(
      (status) => status[0] === "First Hearing Date"
    )?.[1];
    const nextHearingDate = caseStatus?.find(
      (status) => status[0] === "Next Hearing Date"
    )?.[1];
    const caseStage = caseStatus?.find(
      (status) => status[0] === "Case Stage"
    )?.[1];
    const links = detail.cnrDetails["Links"];
    const filingDate = caseDetails?.["Filing Date"]
    const filingNumber = caseDetails?.['Filing Number']
    const registrationDate = caseDetails?.["Registration Date:"]
    const registrationNumber = caseDetails?.['Registration Number']

    console.log("registrationDate----", registrationDate)
    return {
      cnrNumber: detail.cnrNumber,
      firstHearingDate,
      nextHearingDate,
      registrationDate,
      registrationNumber,
      filingDate,
      filingNumber,
      caseStage,
      links,
    };
  });

  console.log("table data:", data)

   // Toggle select/unselect for all rows
   const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(originalCnrDetails.map((row) => row.cnrNumber)); // Select all
    }
  };

  const handleDownload = () => {
    let filterCaseData = originalCnrDetails.filter(item => selectedRows.includes(item.cnrNumber));
    console.log("caseDetailsList filtered :::", filterCaseData);
    if(!filterCaseData.length ){
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

  console.log("selectedRows:", selectedRows)


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
        width: "50px", // Set a fixed width for the checkbox column
      },
    {
      name: "CNR Number",
      selector: (row) => row.cnrNumber,
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
    {
      name: "Filing Date",
      selector: (row) => row.filingDate,
      sortable: true,
    },
    {
      name:"Filing Number",
      selector: (row) => row.filingNumber,
      sortable: true,
    },
    {
      name: "Registration Date",
      selector: (row) => row.registrationDate,
      sortable: true,
    },
    {
      name:"Registration Number",
      selector: (row) => row.registrationNumber,
      sortable: true,
      width:"208px"
    },
    {
      name: "Case Stage",
      selector: (row) => row.caseStage,
      sortable: true,
    },
    {
      name: "Order Sheet",
      cell: (row) => (
        <div>
          {row.links.map((link, index) => (
            <React.Fragment key={index}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Order Sheet {index + 1}
              </a>
              <br />
            </React.Fragment>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <button
        onClick={handleDownload}
        disabled={!data.length === 0}
        className={`px-4 py-2 text-white font-semibold rounded-lg ${
          !data.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        Export
      </button>

      <DataTable
        title="CNR Details"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive
        customStyles={{
          rows: {
            style: {
              minHeight: "72px", // Override the row height
            },
          },
          headCells: {
            style: {
              fontWeight: "bold",
              fontSize: "16px",
            },
          },
        }}
      />
    </div>
  );
};

export default CnrDetailsTable;
