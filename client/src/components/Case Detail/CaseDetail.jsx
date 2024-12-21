import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CaseDetail = () => {
  const [data, setData] = useState([]);
  const { cnrNumber } = useParams();
  function fetchData() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cnr/get-singlecnr/${cnrNumber}`)
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  useEffect(() => {
    fetchData();
  });

  const intrimOrders = data?.intrimOrders || [];

  // Case Details Columns
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

  // Respondent and Petitioner Data
  const rowData =
    data?.respondentAndAdvocate?.map((item) => {
      const names = item[0]
        ?.split("\n")
        .map((entry) => entry.trim())
        .join("\n"); // Join names into a single string with line breaks
      return {
        partyType: "Respondent",
        name: names, // All names combined into one string
        advocate: "", // Advocate info if needed
        address: "Address not available",
      };
    }) || [];

  const rowData2 =
    data?.petitionerAndAdvocate?.map((item) => {
      const names = item[0]
        ?.split("\n")
        .map((entry) => entry.trim())
        .join("\n"); // Join names into a single string with line breaks
      return {
        partyType: "Petitioner",
        name: names, // All names combined into one string
        advocate: "", // Advocate info if needed
        address: "Address not available",
      };
    }) || [];

  // Case History Table Logic
  const caseHistory = data?.caseHistory || [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap bg-gray-100 rounded-lg">
        {/* Case Details */}
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
          {[
            { title: "Respondent", data: rowData },
            { title: "Petitioner", data: rowData2 },
          ].map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-left text-lg font-bold mb-2 text-green-600">
                {section.title}
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
                    {section.data.map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-green-200 px-2 py-1">
                          {row.partyType}
                        </td>
                        <td
                          className="border border-green-200 px-2 py-1"
                          style={{ whiteSpace: "pre-line" }}
                        >
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
          ))}
        </div>

        {/* Case History */}
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
                  {caseHistory.length > 0 ? (
                    caseHistory.slice(1).map((row, index) => (
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

        {/* Interim Orders */}
        <div className="w-full p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
              Interim Orders
            </h2>
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
                          <a
                            href={order.s3_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Order
                          </a>
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
