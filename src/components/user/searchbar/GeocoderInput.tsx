import React,{useEffect}from 'react';
import { useValue } from '../../../context/ContextProvider';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useDispatch } from 'react-redux';
import { clearAddress, filterAddress } from '../../../store/slices/userSlice';

const ctrl = new MapboxGeocoder({
  marker:false,
  accessToken:import.meta.env.VITE_MAPBOX_TOKEN,
})

const GeocoderInput: React.FC = () => {
  const dispatch = useDispatch();
  const {mapRef,containerRef} = useValue();

  useEffect(() => {
    if (containerRef.current) {
      const firstChild = containerRef.current.children[0] as (HTMLElement | null);
      if (firstChild) {
        firstChild.remove();
      }
    }
  
    // Check if mapRef.current exists before calling getMap
    const map = mapRef.current?.getMap();
    if (map && containerRef.current) {
      const mapElement = containerRef.current as HTMLElement;
      mapElement.appendChild(ctrl.onAdd(map));
      
      ctrl.on('result', (e) => {
        const coords = e.result.geometry.coordinates;
        const hotelName = e.result.text;
        dispatch(filterAddress({ longitude: coords[0], latitude: coords[1],hotelName }));
      });
  
      ctrl.on('clear', () => dispatch(clearAddress()));
    }
  }, [mapRef, containerRef, dispatch]);
  
  return (
    <>
      
    </>
  );
};

export default GeocoderInput;