import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons for collapse/expand

const Modal = ({ caseData = {}, closeModal, saveCase, setCcFields }) => {
  const [openSections, setOpenSections] = useState({
    caseDetails: true,
    caseStatus: false,
    firDetails: false,
    caseHistory: false,
    advocates: false,
  });
  const [saveDisabled, setSaveDisabled] = useState(false); 
  const [internalCcFields, setInternalCcFields] = useState([]); 
  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleCcFieldChange = (index, field, value) => {
    const updatedFields = [...internalCcFields];
    updatedFields[index][field] = value;
    setInternalCcFields(updatedFields); 
    setCcFields(updatedFields); 
  };

  const addCcField = () => {
    const updatedFields = [...internalCcFields, { name: "", email: "" }];
    setInternalCcFields(updatedFields); // Update internal state
    setCcFields(updatedFields); // Update parent state through the callback
  };

  const removeCcField = (index) => {
    const updatedFields = internalCcFields.filter((_, i) => i !== index);
    setInternalCcFields(updatedFields); // Update internal state
    setCcFields(updatedFields); // Update parent state through the callback
  };

  const renderCcFields = () => (
    <div>
      {internalCcFields.map((field, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Name"
            value={field.name}
            onChange={(e) => handleCcFieldChange(index, "name", e.target.value)}
            className="border px-4 py-2 rounded w-1/2"
          />
          <input
            type="email"
            placeholder="Email"
            value={field.email}
            onChange={(e) =>
              handleCcFieldChange(index, "email", e.target.value)
            }
            className="border px-4 py-2 rounded w-1/2"
          />
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => removeCcField(index)}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );


  const renderTable = (headers, rows) => {
    if (!rows || rows.length === 0) return <p>No data available.</p>;

    return (
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {row.map((cell, i) => (
                <td key={i} className="px-4 py-2">
                  {cell || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Utility function to handle the case where advocates might not be an array
  const formatAdvocate = (advocates) => {
    if (!advocates || advocates.length === 0) {
      return "No advocates listed.";
    }
    return Array.isArray(advocates) ? advocates.join(", ") : advocates;
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-11/12 max-w-2xl shadow-lg max-h-[80vh] overflow-y-auto scroll-smooth">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Case Details</h3>
          <button
            className="text-red-500 text-xl hover:text-red-700"
            onClick={closeModal}
          >
            X
          </button>
        </div>

        <Section
          title="Case Details"
          isOpen={openSections.caseDetails}
          toggle={() => toggleSection("caseDetails")}
        >
          {renderTable(
            ["Field", "Details"],
            [
              ["CNR Number", caseData?.cnrNumber || "N/A"], // Access directly from caseData
              ["Case Type", caseData.caseType || "N/A"],
              ["Filing Date", caseData.filingDate || "N/A"],
              ["Filing Number", caseData.filingNumber || "N/A"],
              ["Registration Date", caseData.registrationDate || "N/A"],
              ["Registration Number", caseData.registrationNumber || "N/A"],
              [
                "Acts",
                Array.isArray(caseData.acts) && caseData.acts.length > 0
                  ? caseData.acts.join(", ")
                  : "N/A",
              ],
            ]
          )}
        </Section>

        <Section
          title="Case Status"
          isOpen={openSections.caseStatus}
          toggle={() => toggleSection("caseStatus")}
        >
          {renderTable(
            ["Field", "Details"],
            [
              ["First Hearing Date", caseData.caseStatus?.[0]?.[1] || "N/A"],
              [
                "Decision Date",
                caseData.caseStatus?.[1]?.[1] === caseData.caseStatus?.[2]?.[1]
                  ? caseData.caseStatus?.[1]?.[1] || "N/A"
                  : `Decision Date: ${
                      caseData.caseStatus?.[1]?.[1] || "N/A"
                    }, Next Hearing Date: ${
                      caseData.caseStatus?.[2]?.[1] || "N/A"
                    }`,
              ],
              ["Case Status", caseData.caseStatus?.[2]?.[1] || "N/A"],
              ["Nature of Disposal", caseData.caseStatus?.[3]?.[1] || "N/A"],
              [
                "Court Number and Judge",
                caseData.caseStatus?.[4]?.[1] || "N/A",
              ],
            ]
          )}
        </Section>

        <Section
          title="Case History"
          isOpen={openSections.caseHistory}
          toggle={() => toggleSection("caseHistory")}
        >
          {renderTable(
            ["Field", "Details"],
            Array.isArray(caseData.caseHistory)
              ? caseData.caseHistory.map((history) => [history[0], history[2]])
              : [] // Default to an empty array if caseHistory isn't an array
          )}
        </Section>

        <Section
          title="FIR Details"
          isOpen={openSections.firDetails}
          toggle={() => toggleSection("firDetails")}
        >
          {renderTable(
            ["Field", "Details"],
            [
              ["FIR Number", caseData.firDetails?.["FIR Number"] || "N/A"],
              [
                "Police Station",
                caseData.firDetails?.["Police Station"] || "N/A",
              ],
              ["Year", caseData.firDetails?.["Year"] || "N/A"],
            ]
          )}
        </Section>

        <Section
          title="Case History"
          isOpen={openSections.caseHistory}
          toggle={() => toggleSection("caseHistory")}
        >
          {renderTable(
            ["Field", "Details"],
            Array.isArray(caseData.caseHistory)
              ? caseData.caseHistory.map((history) => [history[0], history[2]])
              : [] // Default to an empty array if caseHistory isn't an array
          )}
        </Section>

        <Section
          title="Advocates"
          isOpen={openSections.advocates}
          toggle={() => toggleSection("advocates")}
        >
          {renderTable(
            ["Field", "Details"],
            [
              [
                "Petitioner and Advocate",
                formatAdvocate(caseData?.petitionerAndAdvocate),
              ],
              [
                "Respondent and Advocate",
                formatAdvocate(caseData?.respondentAndAdvocate),
              ],
            ]
          )}
        </Section>

        <div className="flex flex-col justify-between mt-8 space-y-6">
          {/* CC Fields Section */}
          <div className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
            <div>{renderCcFields()}</div>
            <button
              onClick={addCcField}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow-md transition duration-300 mt-4"
            >
              Add Another Mail CC
            </button>
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={saveCase}
              disabled={saveDisabled}
              className={`py-2 px-6 rounded-lg font-medium transition duration-300 ${
                saveDisabled
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              }`}
            >
              {saveDisabled ? "Saved" : "Save Case"}
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-400 shadow-md transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Component for Collapsible Sections
const Section = ({ title, isOpen, toggle, children }) => (
  <div className="mb-6">
    <h4
      className="flex justify-between items-center text-xl font-semibold cursor-pointer text-blue-600 hover:text-blue-800"
      onClick={toggle}
    >
      <span>{title}</span>
      {isOpen ? (
        <FaChevronUp className="text-xl" />
      ) : (
        <FaChevronDown className="text-xl" />
      )}
    </h4>
    {isOpen && <div className="mt-2">{children}</div>}
  </div>
);

export default Modal;
