import React, { useEffect, useRef } from 'react';
import { Box } from "@mui/material";
import ReactMapGL, { Marker, NavigationControl,GeolocateControl, MapRef} from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/types';
import 'mapbox-gl/dist/mapbox-gl.css';
import { updateLocation } from '../../../../../store/slices/adminSlice';
import mapboxgl from 'mapbox-gl';
import Geocoder from './Geocoder';

const AddLocation: React.FC = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.admin.hotelLocation);
  
  console.log('Location', location);
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (!location.longitude && !location.latitude) {
      fetch('https://ipapi.co/json')
  .then((response) => response.json())
  .then((data) => {
    if (mapRef.current) {
      const newCenter = new mapboxgl.LngLat(data.longitude, data.latitude);
      mapRef.current.flyTo({
        center: newCenter,
      });
      dispatch(updateLocation({ longitude: data.longitude, latitude: data.latitude }));
    } else {
      console.error('Map reference is null.');
    }
  })
  .catch((error) => {
    console.error('Error fetching location data:', error);
  });

    }
  }, [location.longitude, location.latitude, dispatch, mapRef]);
  
  

  return (
    <Box
      sx={{
        height: 400,
        position: 'relative',
      }}
    >
      <ReactMapGL
      ref={mapRef}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 8,
        }}
        mapStyle='mapbox://styles/mapbox/streets-v11'
      >
        <Marker
          longitude={location.longitude}
          latitude={location.latitude}
          draggable
          onDragEnd={(e) =>
            dispatch(updateLocation({ longitude: e.lngLat.lng, latitude: e.lngLat.lat }))
          }
        />
        <NavigationControl position='bottom-right' />
        <GeolocateControl position='top-left'
        trackUserLocation
        onGeolocate={(e) => dispatch(updateLocation({ longitude: e.coords.longitude, latitude: e.coords.latitude}))}
        />
        <Geocoder/>
      </ReactMapGL>
    </Box>
  );
};

export default AddLocation;
