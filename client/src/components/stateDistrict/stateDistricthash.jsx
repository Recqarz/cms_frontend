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
  DLWC: {
    state: "Delhi",
    district: "West",
    court: "Tis Hazari Courts Complex",
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
};

export function getDetailsFromCNR(cnr) {
  if (!cnr || typeof cnr !== "string" || cnr.length < 3) {
    return {
      state: "NA",
      district: "NA",
      court: "NA",
    };
  }
  const prefix4 = cnr.slice(0, 4);
  const prefix3 = cnr.slice(0, 3);
  if (cnrMapping[prefix4]) {
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
