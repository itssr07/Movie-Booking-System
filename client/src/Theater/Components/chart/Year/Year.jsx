import React, { useState, useEffect } from "react";
import axios from "../../../../utils/axios";
import LineChart from "react-apexcharts";
import { toast, ToastContainer } from "react-toastify";
import {ResponsiveContainer,} from "recharts";
import { useSelector } from "react-redux";
import { OnereservationDetails } from "../../../../utils/Constants";
const Year = ({ aspect, title }) => {
  const generateError = (error) =>
  toast.error(error, {
    position: "top-right",
  });
  const token = useSelector((state) => state.theater.token);
  const theater = useSelector(state=>state.theater?.theater);
  const theaterId=theater?._id
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [],
    },
  });
  
  const [series, setSeries] = useState([
    {
      name: "Yearly Revenue",
      data: [],
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${OnereservationDetails}/${theaterId}`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
   
        const bookings = response.data;

        // Group revenue by year and sum up the total revenue for each year
        const revenueByYear = bookings.reduce((acc, booking) => {
          const year = new Date(booking.bookedDate).getFullYear();
          acc[year] = acc[year] || 0;
          acc[year] += booking.total;
          return acc;
        }, {});

        // Create x-axis categories and series data
        const categories = Object.keys(revenueByYear);
        const data = Object.values(revenueByYear);

        setOptions({
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: categories,
          },
        });

        setSeries([
          {
            name: "Yearly Revenue",
            data: data,
          },
        ]);
      } catch (error) {
          if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        generateError(error.response.data.message);
      }
      }
    };

    fetchData();
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


}

export default Year
