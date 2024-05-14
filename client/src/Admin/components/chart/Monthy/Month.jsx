import axios from "../../../../utils/axios";
import LineChart from "react-apexcharts";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import { reservationDetails } from "../../../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";


const Month = ({ aspect, title }) => {
  const token = useSelector((state) => state.admin.token);
  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
    },

    xaxis: {
      Months: [
        "Jan",
        "Febr",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Septe",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  });

  const [series, setSeries] = useState([
    {
      name: "Monthly Revenue",
      data: [],
    },
  ]);

  useEffect(() => {
    try {
      axios
        .get(reservationDetails, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(")))))))))))))))))))))))))))))",response)
          // Group bookings by month and calculate total revenue
          const bookingsByMonth = response.data.reduce((result, booking) => {
            const month = new Date(booking.bookedDate).getMonth();
            result[month] = (result[month] || 0) + booking.total;
            return result;
          }, {});

          // Convert the bookingsByMonth object into an array of data for the chart
          const chartData = options.xaxis.Months.map((month, index) => ({
            x: month,
            y: bookingsByMonth[index] || null,
            color: bookingsByMonth[index] ? "#0070f3" : "#e5e7eb",
          }));

          setSeries([{ data: chartData }]);
        })
        .catch((error) => {
          if (error.response) {
            generateError(error.response.data.message);
          } else {
            generateError("Network error. Please try again later.");
          }
        });
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
    }
  }, []);

  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect}>
        <LineChart options={options} series={series} type="bar" width="500" />
      </ResponsiveContainer>
      <ToastContainer />
    </div>
  );
};

export default Month;
