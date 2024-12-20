import React from "react";

const CaseDetail = () => {
  const rowData = [
    {
      partyType: "Individual",
      name: "Rajesh Kumar",
      advocate: "Amit Verma",
      address: "Delhi, India",
    },
    {
      partyType: "Company",
      name: "TechCorp Pvt Ltd",
      advocate: "Neha Sharma",
      address: "Mumbai, India",
    },
    {
      partyType: "NGO",
      name: "Green Earth",
      advocate: "Ravi Kapoor",
      address: "Bangalore, India",
    },
  ];

  const caseDetails = {
    column1: [
      { label: "Case Type", value: "CS(COMM.)" },
      { label: "Filing Number", value: "1291/2021" },
      { label: "Filing Date", value: "31-03-2021" },
      { label: "Registration Number", value: "278/2021" },
      { label: "CNR Number", value: "DLNW010029522021" },
    ],
    column2: [
      { label: "Registration Date", value: "01-04-2021" },
      { label: "Court Name", value: "Delhi High Court" },
      { label: "Judge Name", value: "Justice R.K." },
      { label: "Case Stage", value: "Hearing" },
      { label: "Next Hearing Date", value: "15-01-2024" },
    ],
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap bg-gray-100 rounded-lg">
        {/* Case Details */}
        <div className="w-full md:w-1/2 p-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <h1 className="text-center text-lg font-bold mb-4 py-2 bg-green-100 text-green-600 rounded-lg">
              Case Details
            </h1>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {caseDetails.column1.map((item, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-800">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex-1">
                {caseDetails.column2.map((item, index) => (
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

        {/* Respondent and Petitioner */}
        <div className="w-full md:w-1/2 p-4 space-y-6">
          {[
            { title: "Respondent", data: rowData },
            { title: "Petitioner", data: rowData },
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
                        <td className="border border-green-200 px-2 py-1">
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
      </div>
    </div>
  );
};

export default CaseDetail;