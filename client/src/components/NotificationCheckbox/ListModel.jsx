import React, { useState } from "react";
import NotificationCheckbox from "./NotificationCheckbox";

const ListModel = ({ isOpen, closeModal }) => {
  const [checkboxStates, setCheckboxStates] = useState({
    comments: false,
    candidates: false,
    offers: false,
    postings: false,
    rejections: false,
  });

  // Handle checkbox change
  const handleCheckboxChange = (checkbox, checked) => {
    if (checked) {
      // If a checkbox is selected, reset the others and select the clicked one
      setCheckboxStates({
        comments: checkbox === "comments" ? true : false,
        candidates: checkbox === "candidates" ? true : false,
        offers: checkbox === "offers" ? true : false,
        postings: checkbox === "postings" ? true : false,
        rejections: checkbox === "rejections" ? true : false,
      });
    } else {
      // Allow deselecting
      setCheckboxStates((prevState) => ({
        ...prevState,
        [checkbox]: false,
      }));
    }
  };

  // Check if any checkbox is selected
  const showButton = Object.values(checkboxStates).includes(true);

  return (
    <>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[50em] p-6">
            <h1 className="text-3xl text-center font-bold text-gray-900 uppercase mb-4">
              Client Selectors
            </h1>
            <div className="space-y-4 px-20 overflow-y-auto max-h-96">
              {/* Scrollable content */}
              {[
                "comments",
                "candidates",
                "offers",
                "postings",
                "rejections",
              ].map((checkbox) => (
                <NotificationCheckbox
                  key={checkbox}
                  name={checkbox}
                  checked={checkboxStates[checkbox]}
                  onCheckboxChange={(checked) =>
                    handleCheckboxChange(checkbox, checked)
                  }
                  disabled={showButton && !checkboxStates[checkbox]} // Disable other checkboxes if one is selected
                />
              ))}
            </div>

            {/* Conditional rendering for button */}
            {showButton && (
              <div className="flex justify-end mt-4">
                <button className="sm:text-3xl font-medium uppercase bg-green-300 px-4 py-2 rounded-md">
                  Ok
                </button>
              </div>
            )}

            {/* Close button */}
            <div className="absolute  md:bottom-[40rem] right-2 md:right-[41rem]">
              <button
                onClick={closeModal}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListModel;
