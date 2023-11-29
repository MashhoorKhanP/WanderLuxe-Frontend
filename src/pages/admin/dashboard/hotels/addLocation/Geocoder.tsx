import React from 'react';
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useDispatch } from 'react-redux';
import { useControl } from 'react-map-gl';
import { updateLocation } from '../../../../../store/slices/adminSlice';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const Geocoder: React.FC = () => {
 const dispatch = useDispatch();
 const ctrl = new MapBoxGeocoder({
  accessToken:import.meta.env.VITE_MAPBOX_TOKEN,
  marker:false,
  collapsed:true
 })
 useControl(() =>ctrl)
 ctrl.on(`result`, (e) => {
  const cords = e.result.geometry.coordinates
  dispatch(updateLocation({longitude: cords[0], latitude: cords[1]}))
 })
  
 return null;
  
};

export default Geocoder;