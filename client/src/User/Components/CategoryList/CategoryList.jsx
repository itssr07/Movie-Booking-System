import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { SwiperSlide, Swiper } from "swiper/react";
import { useSelector } from "react-redux";
import Moviecategory from "../Movie-category/Movie-category";
import { searchMovie } from "../../../utils/Constants";
import { toast, ToastContainer } from "react-toastify";

const CategoryList = (props) => {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const searchKey = useSelector((state) => state.searchKey);

  const generateError = (error) =>
    toast.error(error, {
      position: "top-right",
    });

  const searchMovies = async (searchKey) => {
    try {
      const searchedMovies = await axios
        .get(`${searchMovie}/${searchKey}`)
        .then((response) => {
          setSearchedMovies(response.data.movie);
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
  };

  useEffect(() => {
    searchMovies(searchKey);
  }, [searchKey]);

  return (
    <div
      className="movie-list"
      style={{
        paddingLeft: "100px",
        backgroundColor: "rgb(243,241,241)",
        borderColor: "white",
      }}
    >
      <Swiper grabCursor={true} spaceBetween={50} slidesPerView={"auto"}>
        <SwiperSlide>
          <div className="movie-card-container">
            <Moviecategory searchedMovies={searchedMovies} />
          </div>
        </SwiperSlide>
      </Swiper>
      <ToastContainer />
    </div>
  ); 
};

export default CategoryList;
