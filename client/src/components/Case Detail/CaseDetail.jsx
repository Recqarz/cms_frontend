import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-hot-toast";

const CaseDetail = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { cnrNumber } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cnr/get-singlecnr/${cnrNumber}`
        );
        setData(response.data.data);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to fetch case details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cnrNumber]);

  const intrimOrders = data?.intrimOrders || [];

  const caseDetailsColumn1 = [
    { label: "Case Type", value: data?.caseDetails?.["Case Type"] || "-" },
    {
      label: "Filing Number",
      value: data?.caseDetails?.["Filing Number"] || "-",
    },
    { label: "Filing Date", value: data?.caseDetails?.["Filing Date"] || "-" },
    {
      label: "Registration Number",
      value: data?.caseDetails?.["Registration Number"] || "-",
    },
    { label: "CNR Number", value: data?.caseDetails?.["CNR Number"] || "-" },
  ];

  const caseDetailsColumn2 = [
    {
      label: "Registration Date",
      value: data?.caseDetails?.["Registration Date:"] || "-",
    },
    {
      label: "First Hearing Date",
      value:
        data?.caseStatus?.find(
          (item) => item[0] === "First Hearing Date"
        )?.[1] || "-",
    },
    {
      label: "Court Number and Judge",
      value:
        data?.caseStatus?.find(
          (item) => item[0] === "Court Number and Judge"
        )?.[1] || "-",
    },
    {
      label: "Case Stage",
      value:
        data?.caseStatus?.find((item) => item[0] === "Case Status")?.[1] || "-",
    },
    {
      label: "Next Hearing Date",
      value:
        data?.caseStatus?.find(
          (item) =>
            item[0] === "Decision Date" || item[0] === "Next Hearing Date"
        )?.[1] || "-",
    },
  ];

  const processPartyData = (partyData, partyType) =>
    partyData?.map((item) => ({
      partyType,
      name: item[0]
        ?.split("\n")
        .map((entry) => entry.trim())
        .join("\n"),
      advocate: "",
      address: "Address not available",
    })) || [];

  const respondentData = processPartyData(
    data?.respondentAndAdvocate,
    "Respondent"
  );
  const petitionerData = processPartyData(
    data?.petitionerAndAdvocate,
    "Petitioner"
  );

  const mergeAndDownloadPDF = async () => {
    try {
      const pdfLinks = intrimOrders?.map((order) => order?.s3_url) || [];
      if (pdfLinks.length === 0) {
        toast.error("No PDFs available to merge");
        return;
      }

      const fileName = `${data?.cnrNumber}_merged.pdf`;
      const mergedPdf = await PDFDocument.create();

      for (const link of pdfLinks) {
        const pdfBytes = await fetch(link).then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("PDFs merged and downloaded successfully");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast.error("Failed to merge PDFs");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  const TableSection = ({ title, data }) => (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-left text-lg font-bold mb-2 text-green-600">
        {title}
      </h2>
      <div className="overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="border border-green-300 px-2 py-1 text-left">
                Party Type
              </th>
              <th className="border border-green-300 px-2 py-1 text-left">
                Name
              </th>
              <th className="border border-green-300 px-2 py-1 text-left">
                Advocate
              </th>
              <th className="border border-green-300 px-2 py-1 text-left">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="border border-green-200 px-2 py-1">
                  {row.partyType}
                </td>
                <td className="border border-green-200 px-2 py-1 whitespace-pre-line">
                  {row.name}
                </td>
                <td className="border border-green-200 px-2 py-1">
                  {row.advocate}
                </td>
                <td className="border border-green-200 px-2 py-1">
                  {row.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap bg-gray-100 rounded-lg">
        <div className="w-full md:w-1/2 p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <h1 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
              Case Details
            </h1>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                {caseDetailsColumn1.map((item, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                {caseDetailsColumn2.map((item, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 space-y-6">
          <TableSection title="Respondent" data={respondentData} />
          <TableSection title="Petitioner" data={petitionerData} />
        </div>

        <div className="w-full p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
              Case History
            </h2>
            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-green-100 text-green-700">
                    <th className="border border-green-300 px-2 py-1 text-left">
                      Judge
                    </th>
                    <th className="border border-green-300 px-2 py-1 text-left">
                      Business on Date
                    </th>
                    <th className="border border-green-300 px-2 py-1 text-left">
                      Hearing Date
                    </th>
                    <th className="border border-green-300 px-2 py-1 text-left">
                      Purpose of Hearing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.caseHistory?.length > 1 ? (
                    data.caseHistory.slice(1).map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-green-200 px-2 py-1">
                          {row[0] || "-"}
                        </td>
                        <td className="border border-green-200 px-2 py-1">
                          {row[1] || "-"}
                        </td>
                        <td className="border border-green-200 px-2 py-1">
                          {row[2] || "-"}
                        </td>
                        <td className="border border-green-200 px-2 py-1">
                          {row[3] || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="border border-green-200 px-2 py-1"
                        colSpan="4"
                      >
                        No case history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="w-full p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
              Interim Orders
            </h2>
            <div className="flex justify-end mb-2">
              <button
                onClick={mergeAndDownloadPDF}
                className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded-md transition-colors"
                disabled={intrimOrders.length === 0}
              >
                Download Merged PDF
              </button>
            </div>
            <div className="overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-green-100 text-green-700">
                    <th className="border border-green-300 px-2 py-1 text-left">
                      Order Date
                    </th>
                    <th className="border border-green-300 px-2 py-1 text-left">
                      Order Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {intrimOrders.length > 0 ? (
                    intrimOrders.map((order, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-green-200 px-2 py-1">
                          {order.order_date || "-"}
                        </td>
                        <td className="border border-green-200 px-2 py-1">
                          <Link
                            to={order.s3_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Order
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="border border-green-200 px-2 py-1"
                        colSpan="2"
                      >
                        No interim orders available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
