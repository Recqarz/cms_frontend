const cnrMapping = {
  DLSW: {
    state: "Delhi",
    district: "South West",
    court: "Dwarka Courts Complex",
  },
  DLNW: {
    state: "Delhi",
    district: "North West",
    court: "Rohini Courts Complex",
  },
  DLNE: {
    state: "Delhi",
    district: "North East",
    court: "Karkardooma Courts Complex",
  },
  DLSE: {
    state: "Delhi",
    district: "South East",
    court: "Saket Courts Complex",
  },
  DLCT: {
    state: "Delhi",
    district: "Central",
    court: "Tis Hazari Courts Complex",
  },
  DLNC: {
    state: "Delhi",
    district: "North Central",
    court: "Tis Hazari Courts Complex",
  },
  DLWC: {
    state: "Delhi",
    district: "West Central",
    court: "Tis Hazari Courts Complex",
  },
  DLSC: {
    state: "Delhi",
    district: "South Central",
    court: "Saket Courts Complex",
  },
  DLEC: {
    state: "Delhi",
    district: "East Central",
    court: "Karkardooma Courts Complex",
  },
  DLS: { state: "Delhi", district: "South", court: "Saket Courts Complex" },
  DLN: { state: "Delhi", district: "North", court: "Rohini Courts Complex" },
  DLE: {
    state: "Delhi",
    district: "East",
    court: "Karkardooma Courts Complex",
  },
  DLC: {
    state: "Delhi",
    district: "Central",
    court: "Tis Hazari Courts Complex",
  },
  DLSHD: {
    state: "Delhi",
    district: "Shahdara",
    court: "Karkardooma Courts Complex",
  },
  HRAMA: {
    state: "Haryana",
    district: "Ambala",
    court: "District Court, Ambala",
  },
  HRBH: {
    state: "Haryana",
    district: "Bhiwani",
    court: "District Court, Bhiwani",
  },
  HRFB: {
    state: "Haryana",
    district: "Faridabad",
    court: "District Court, Faridabad",
  },
  HRFTA: {
    state: "Haryana",
    district: "Fatehabad",
    court: "District Court, Fatehabad",
  },
  HRGR: {
    state: "Haryana",
    district: "Gurugram",
    court: "District Court, Gurugram",
  },
  HRHSA: {
    state: "Haryana",
    district: "Hisar",
    court: "District Court, Hisar",
  },
  HRJRA: {
    state: "Haryana",
    district: "Jhajjar",
    court: "District Court, Jhajjar",
  },
  HRJNA: {
    state: "Haryana",
    district: "Jind",
    court: "District Court, Jind",
  },
  HRKH: {
    state: "Haryana",
    district: "Kaithal",
    court: "District Court, Kaithal",
  },
  HRKRA: {
    state: "Haryana",
    district: "Karnal",
    court: "District Court, Karnal",
  },
  HRKU: {
    state: "Haryana",
    district: "Kurukshetra",
    court: "District Court, Kurukshetra",
  },
  HRNRA: {
    state: "Haryana",
    district: "Narnaul",
    court: "District Court, Narnaul",
  },
  HRNU: {
    state: "Haryana",
    district: "Nuh",
    court: "District Court, Nuh",
  },
  HRPLA: {
    state: "Haryana",
    district: "Palwal",
    court: "District Court, Palwal",
  },
  HRPK: {
    state: "Haryana",
    district: "Panchkula",
    court: "District Court, Panchkula",
  },
  HRPPA: {
    state: "Haryana",
    district: "Panipat",
    court: "District Court, Panipat",
  },
  HRREA: {
    state: "Haryana",
    district: "Rewari",
    court: "District Court, Rewari",
  },
  HRRHA: {
    state: "Haryana",
    district: "Rohtak",
    court: "District Court, Rohtak",
  },
  HRSI: {
    state: "Haryana",
    district: "Sirsa",
    court: "District Court, Sirsa",
  },
  HRSOB: {
    state: "Haryana",
    district: "Sonepat",
    court: "District Court, Sonepat",
  },
  HRYN: {
    state: "Haryana",
    district: "Yamunanagar",
    court: "District Court, Yamunanagar",
  },
};

export function getDetailsFromCNR(cnr) {
  if (!cnr || typeof cnr !== "string" || cnr.length < 3) {
    return {
      state: "NA",
      district: "NA",
      court: "NA",
    };
  }
  const prefix5 = cnr.slice(0, 5);
  const prefix4 = cnr.slice(0, 4);
  const prefix3 = cnr.slice(0, 3);
  if (cnrMapping[prefix5]) {
    return cnrMapping[prefix5];
  }else if (cnrMapping[prefix4]) {
    return cnrMapping[prefix4];
  } else if (cnrMapping[prefix3]) {
    return cnrMapping[prefix3];
  } else {
    return {
      state: "NA",
      district: "NA",
      court: "NA",
    };
  }
}
