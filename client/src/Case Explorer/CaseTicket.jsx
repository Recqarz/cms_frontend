import React from "react";
import Nodatafound from "../assets/Images/Nodata_found.png";

const CaseTicket = () => {
  return (
    <div>
      <img
        src={Nodatafound}
        alt="No cases found"
        className="max-w-xs mx-auto mb-4"
      />
    </div>
  );
};

export default CaseTicket;