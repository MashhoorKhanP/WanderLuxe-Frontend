import React from 'react';
import { Box } from "@mui/material";
import ReactMapGL, { Marker, NavigationControl,GeolocateControl } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/types';
import 'mapbox-gl/dist/mapbox-gl.css';
import { updateLocation } from '../../../../../store/slices/adminSlice';

const AddLocation: React.FC = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.admin.location);
  
  console.log('Location', location);

  return (
    <Box
      sx={{
        height: 400,
        position: 'relative',
      }}
    >
      <ReactMapGL
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
      </ReactMapGL>
    </Box>
  );
};

export default AddLocation;
