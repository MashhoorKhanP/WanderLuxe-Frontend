import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { CorporateFare, TravelExplore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { getHotels } from "../../../actions/hotel";
import MapScreen from "../map/MapScreen";
import HotelListScreen from "../hotels/HotelListScreen";
import RoomListScreen from "../rooms/RoomListScreen";
import { getRooms } from "../../../actions/room";
import WishListScreen from "../wishlist/WishlistScreen";
import BookingScreen from "../booking/BookingScreen";
import ChangePasswordScreen from "../password/ChangePasswordScreen";
import PaymentSuccessScreen from "../booking/PaymentSuccessScreen";
import PaymentFailedScreen from "../booking/PaymentFailedScreen";
import MyBookingsScreen from "../booking/MyBookingsScreen";
import MyWalletScreen from "../wallet/MyWalletScreen";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative, Lazy, Navigation, Pagination, Zoom } from "swiper";
import { RootState } from "../../../store/types";
import { getBanners } from "../../../actions/banner";
import PageNotFound from "../../../components/common/NotFound";
interface CustomSwiperOptions {
  lazy?: boolean;
}

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const bannerImages = useSelector((state: RootState) => state.admin.bannerImages);
  const banner:any = useSelector((state: RootState) => state.admin.banners);
  console.log(banner,'bannerfro home')
  useEffect(() => {
    if (!bannerImages.length) {
      dispatch(getBanners());
    }
  }, [dispatch]);

  const handleFindHotels = () => {
    navigate("/find-hotels");
    dispatch(getHotels());
  };

  const handleViewHotels = () => {
    navigate("/view-hotels");
    dispatch(getRooms());
  };

  const CarouselSection = ({ images }: any) => {
    return (
      <Swiper
        modules={[Autoplay, Lazy, Navigation, EffectCreative, Pagination, Zoom]}
        lazy
        navigation
        speed={800}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000, // Set the delay between transitions
          disableOnInteraction: true,
        }}
        effect="creative"
        creativeEffect={{
          prev: {
            shadow: true,
            translate: [0, 0, -400],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        breakpoints={{
          1024: {
            slidesPerView: 2,
          },
          600: {
            slidesPerView: 1,
          },
        }}
        
        style={{
          "--swiper-pagination-color": "rgba(255,255,255,0.5)",
          "--swiper-pagination-bullet-active-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": 0.5,
          "--swiper-navigation-color": "#fff",
          "--swiper-navigation-size": "25px",
          background: "rgba(0, 0, 0, 0.2)", 
          
        } as React.CSSProperties}
        {...({ lazy: true } as CustomSwiperOptions)}
      >
        {images.map((image: string, index: number) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Carousel Image ${index + 1}`} style={{ width: '100%', objectFit: "cover", overflow: 'hidden', height: '100vh' }} />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };
  const carouselImages1 = bannerImages;

  const addLineBreakBeforeLastWord = (text: string) => {
    // Match words (including words with apostrophes) and non-word characters
    const wordMatches = text.match(/[\w'-]+|[^\w'-]+/g);
  
    if (wordMatches) {
      // Find the index of the last word
      const lastWordIndex = wordMatches.length - 1;
  
      // Add \n before the last word
      return wordMatches
        .map((word, index) =>
          index === lastWordIndex ? `\n${word}` : word
        )
        .join('');
    }
  
    // Return the original text if there are no word matches
    return text;
  };

  return (
    <>
      {location.pathname === "/find-hotels" ? (
        <MapScreen />
      ) : location.pathname === "/view-hotels" ? (
        <>
          <HotelListScreen />
        </>
      ) : location.pathname === "/view-rooms" ? (
        <>
          <RoomListScreen />
        </>
      ) : location.pathname === "/wishlist" ? (
        <>
          <WishListScreen />
        </>
      ) : location.pathname === "/book-room" ? (
        <>
          <BookingScreen />
        </>
      ) : location.pathname === "/payment-success" ? (
        <>
          <PaymentSuccessScreen />
        </>
      ) : location.pathname === "/payment-failed" ? (
        <>
          <PaymentFailedScreen />
        </>
      ) : location.pathname === "/change-password" ? (
        <>
          <ChangePasswordScreen />
        </>
      ) : location.pathname === "/my-bookings" ? (
        <>
          <MyBookingsScreen />
        </>
      ) : location.pathname === "/my-wallet" ? (
        <>
          <MyWalletScreen />
        </>
      ) : location.pathname === "/404" ? (
        <>
          <PageNotFound />
        </>
      ) : (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              position: "absolute",
              width: "100%",
              top: "10%",
              right: "20px",
              gap: 1,
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleViewHotels}
              sx={{ borderColor: "white", color: "white" }}
              endIcon={<CorporateFare />}
            >
              View Hotels
            </Button>
            <Button
              variant="outlined"
              onClick={handleFindHotels}
              sx={{ borderColor: "white", color: "white" }}
              endIcon={<TravelExplore />}
            >
              Find Hotels
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              
              zIndex: -10,
            }}
          >
            <CarouselSection images={carouselImages1} />
          </Box>
          
            <Typography
              variant="h3"
              color="white"
              fontWeight={400}
              sx={{
                  position: "absolute",
                  left: "50px", // Adjust the left positioning as needed
                  top: "50%", // Center vertically
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  bgcolor:'#00000091',
                  padding:'10px',
                  color:'#ffffff',
                  whiteSpace: "pre-wrap",
                  fontFamily:'Courier New, Courier, monospace',
                  // Add this to ensure the line break is displayed correctly
              }}
              >
              {addLineBreakBeforeLastWord(String(banner?.text))}
            </Typography>
          
        </Box>
      )}
    </>
  );
};

export default HomeScreen;
