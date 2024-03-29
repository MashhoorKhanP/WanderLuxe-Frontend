import React from "react";
import { Autoplay, Pagination, Lazy, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/lazy";
import "./swiperMap.css";
import { useNavigate } from "react-router-dom";
import { VisibilityOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

interface PopupHotelProps {
  popupInfo: {
    properties: {
      hotelName: string;
      minimumRent: number;
      hotelImages: string[];
      hotelId: string;
    }; // ... other props
  };
  distance: string | number | null;
}
interface CustomSwiperOptions {
  lazy?: boolean;
}

const PopupHotel: React.FC<PopupHotelProps> = ({ popupInfo, distance }) => {
  const navigate = useNavigate();
  const { hotelName, minimumRent, hotelImages, hotelId } = popupInfo.properties;

  return (
    <div className="popup-hotel-container" style={{ paddingBottom: "0px" }}>
      <div className="popup-hotel-carousel">
        <Swiper
          modules={[Autoplay, Pagination, Lazy, Navigation]}
          autoplay
          lazy
          navigation
          pagination={{ clickable: true }}
          style={
            {
              width: "250px",
              height: "200px",
              "--swiper-pagination-color": "rgba(255,255,255,0.5)",
              "--swiper-pagination-bullet-active-color": "#ffffff",
              "--swiper-pagination-bullet-inactive-opacity": 0.5,
              "--swiper-navigation-color": "#fff",
              "--swiper-navigation-size": "25px",
            } as React.CSSProperties
          }
          {...({ lazy: true } as CustomSwiperOptions)}
        >
          {hotelImages.map((url: string) => (
            <SwiperSlide key={url}>
              <img
                src={url}
                alt="hotel"
                style={{
                  width: "100%",
                  height: "255px",
                  display: "block",
                  overflow: "hidden",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div
        className="popup-hotel-header"
        style={{
          padding: 6,
          marginTop: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold", fontSize: "13px" }}>{hotelName}</p>
          {distance && (
            <p
              style={{
                fontWeight: 500,
                fontSize: "11px",
                color:
                  Number(distance) < 20
                    ? "green"
                    : Number(distance) < 30
                    ? "blue"
                    : "red",
              }}
            >
              {`${distance}km from current location.`}
            </p>
          )}
          <p style={{ fontSize: "11px" }}>Rooms start from</p>
          <h2 style={{ fontWeight: "bolder", fontSize: "18px", marginTop: 0 }}>
            {minimumRent === 0 ? "Free Stay" : `₹${minimumRent}`}
          </h2>
        </div>
        <Tooltip
          title="View available rooms"
          onClick={() => navigate(`/view-rooms?hotelId=${hotelId}`)}
        >
          <VisibilityOutlined
            style={{ fontSize: "20px", marginRight: "4px", cursor: "pointer" }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PopupHotel;
