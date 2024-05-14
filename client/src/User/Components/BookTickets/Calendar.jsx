import React, { useState } from "react";
import moment from "moment";
import Carousel from "react-multi-carousel";
import styles from "../Styling/Cinemas.module.scss";
import { useDispatch } from "react-redux";
import { setDates } from "../../../state/user/userSlice";

export const Calendar = () => {
  const dispatch = useDispatch();
  let currentDate = new Date().getDate();
  let currentDay = new Date().getDay();
  let currentYear = new Date().getFullYear();
  let [selectedDate, setSelectedDate] = useState(0);

  let dates = [];
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let i = 0; i < 5; i++) {
    if (currentDate > 30) currentDate = 1;
    if (currentDay === 7) currentDay = 0;

    let currentMonth = months[new Date().getMonth()];

    dates.push({
      date: currentDate,
      day: weekdays[currentDay],
      monthFullName: currentMonth,
      year: currentYear,
    });
    currentDate++;
    currentDay++;
    currentMonth = (currentMonth + 1) % 12;
  }

  const handleDateChange = (index, item) => {
    setSelectedDate(index);
    const selectedDate = moment({
      year: item.year,
      month: months.indexOf(item.monthFullName),
      day: item.date,
    }).toDate().toDateString();
    dispatch(setDates({ date: selectedDate}));
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div style={{ width: 250 }}>
      <Carousel
        className={styles.arrow}
        responsive={responsive}
        removeArrowOnDeviceType={["mobile"]}
      >
        {dates?.map((item, index) => (
          <div
            className={styles.dateItem}
            onClick={() => handleDateChange(index, item)}
            style={
              index === selectedDate
                ? { backgroundColor: "#F84464", color: "white" }
                : { backgroundColor: "transparent" }
            }
            key={item.date}
          >
            <p style={{ color: "white", margin: 0 }}>{item.day?.slice(0, 3)}</p>
            <h2
              style={
                index === selectedDate ? { color: "white" } : { color: "black" }
              }
            >
              {item.date}
            </h2>
            <p style={{ color: "white" }}>{item.monthFullName?.slice(0, 3)}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};
