import React, { useEffect, useState } from "react";
import Nodatafound from "../assets/Images/Nodata_found.png";
import Pagination from "@/components/pagination/pagination";

const CaseHearing = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  return (
    // <div>
    //   <img
    //     src={Nodatafound}
    //     alt="No cases found"
    //     className="max-w-xs mx-auto mb-4"
    //   />
    // </div>
    <div className="relative">
      <div className="shadow-lg rounded-xl p-8 bg-white ">
        <div className="flex flex-col sm:flex-row justify-between mb-6"></div>

        <div className="overflow-x-auto w-full">
          <table className="w-full border rounded-lg">
            <thead className="bg-[#F4F2FF] text-[#6E6893]">
              <tr>
                <th className="py-3 px-4 text-left">CNR Number</th>
                <th className="py-3 px-4 text-left">First Hearing Date</th>
                <th className="py-3 px-4 text-left">Next Hearing Date</th>
                <th className="py-3 px-4 text-left">Details</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((ele, index) => (
                  <tr
                    className="bg-white hover:bg-gray-100"
                    key={ele._id || index}
                  >
                    <td className="py-3 px-4">{ele.cnrNumber}</td>
                    <td className="py-3 px-4">{ele.noOfDocument}</td>
                    <td className="py-3 px-4">
                      {ele.petitioner?.split(" ")[0]} vs{" "}
                      {ele.respondent?.split(" ")[0]}
                    </td>
                    <td className="py-3 px-4">
                      <MdOutlinePreview
                        onClick={() => handleEyeIconClick(ele)}
                        className="text-[#5a518c] text-xl font-semibold cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={Nodatafound}
                        alt="No cases found"
                        className="max-w-xs mx-auto mb-4"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={pageLimit}
          onRowsPerPageChange={setPageLimit}
        />
      </div>
    </div>
  );
};

export default CaseHearing;
