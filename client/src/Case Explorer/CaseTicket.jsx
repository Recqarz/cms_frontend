import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const dummyData = [
  {
    caseHistory: [
      ["Judge", "Business on Date", "Hearing Date", "Purpose of Hearing"],
      [
        "Addl. Chief Judicial Magistrate",
        "07-07-2023",
        "17-07-2023",
        "Misc. Arguments",
      ],
      ["Addl. Chief Judicial Magistrate", "17-07-2023", "25-07-2023", "Charge"],
      ["Addl. Chief Judicial Magistrate", "25-07-2023", "28-07-2023", "Charge"],
      ["Addl. Chief Judicial Magistrate", "28-07-2023", "01-08-2023", "Charge"],
      ["Addl. Chief Judicial Magistrate", "01-08-2023", "08-08-2023", "Charge"],
      [
        "Addl. Chief Judicial Magistrate",
        "08-08-2023",
        "16-08-2023",
        "Misc. Arguments",
      ],
      ["Addl. Chief Judicial Magistrate", "16-08-2023", "24-08-2023", "Order"],
      ["Addl. Chief Judicial Magistrate", "24-08-2023", "28-08-2023", "Charge"],
      [
        "Addl. Chief Judicial Magistrate",
        "28-08-2023",
        "14-09-2023",
        "Prosecution Evidence",
      ],
    ],
    intrimOrders: [
      { order_date: "07-07-2023" },
      { order_date: "17-07-2023" },
      { order_date: "28-07-2023" },
      { order_date: "01-08-2023" },
      { order_date: "08-08-2023" },
      { order_date: "16-08-2023" },
      { order_date: "24-08-2023" },
      { order_date: "28-08-2023" },
    ],
  },
];

const CaseTicket = () => {
  // Prepare data for the Pie Chart (Case History Stages)
  const caseStages = dummyData[0].caseHistory
    .slice(1) // Exclude the header row
    .reduce((acc, curr) => {
      const stage = curr[3]; // Purpose of Hearing
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

  const pieData = {
    labels: Object.keys(caseStages),
    datasets: [
      {
        data: Object.values(caseStages),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // Prepare data for the Bar Chart (Interim Orders Count by Date)
  const interimOrders = dummyData[0].intrimOrders.reduce((acc, curr) => {
    const date = curr.order_date || "No Date";
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(interimOrders),
    datasets: [
      {
        label: "Number of Interim Orders",
        data: Object.values(interimOrders),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    let token = JSON.parse(localStorage.getItem("cmstoken"));
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/cnr/get-disposed-cnr?&currentPage=1&pageLimit=100000000`,
        {
          headers: { token: token },
        }
      )
      .then((response) => {
        console.log("this is ", response.data); // Log the fetched data
        setCases(response.data.data); // Assuming 'data' contains the case data
        setTotalPages(response.data.pageSize);
      })
      .catch((error) => {
        setCases([]);
        setTotalPages(0);
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred.";
        toast.error(errorMessage);
      });
  }

  return (
    <div className="container mx-auto mt-16">
      <h2 className="text-3xl font-semibold text-center mb-8">
        Case Analysis Dashboard
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[45%]">
          <h3 className="text-xl text-center mb-4">Case Stages Distribution</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-[45%]">
          <h3 className="text-xl text-center mb-4">Interim Orders by Date</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default CaseTicket;
