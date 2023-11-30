import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/types';
import { getHotels } from '../../../actions/hotel';
import { AppDispatch } from '../../../store/store';
import ReactMapGL, { GeolocateControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Avatar, Box, Paper, Tooltip } from '@mui/material';
import SuperCluster from 'supercluster';
import './cluster.css';
import { useValue } from '../../../context/ContextProvider';
import { updateLocation } from '../../../store/slices/adminSlice';

interface Hotel {
  _id: string;
  hotelName: string;
  minimumRent: number;
  description: string;
  hotelImages: string[];
  longitude: number;
  latitude: number;
  dropImage: string;
}

interface PointFeature {
  type: 'Feature';
  properties: {
    cluster: boolean;
    hotelId: string;
    hotelName: string;
    minimumRent: number;
    description: string;
    hotelImage: string[];
    longitude: number;
    latitude: number;
    dropImage: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  id?:string;
}

const superCluster = new SuperCluster({
  radius: 75,
  maxZoom: 20,
});

const MapScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector((state: RootState) => state.user.hotels);
  const{ mapRef} = useValue();
  const location = useSelector((state: RootState) => state.admin.hotelLocation);

  console.log('mapRef', mapRef);
  const [points, setPoints] = useState<PointFeature[]>([]);
  const [clusters, setClusters] = useState<PointFeature[]>([]);
  const [bounds, setBounds] = useState<number[]>([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState<number>(0);

  useEffect(() => {
    dispatch(getHotels());
  }, []);
  
  
  useEffect(() => {
    const updatedPoints: PointFeature[] = hotels.map((hotel: Hotel) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        hotelId: hotel._id,
        hotelName: hotel.hotelName,
        minimumRent: hotel.minimumRent,
        description: hotel.description,
        hotelImage: hotel.hotelImages,
        longitude: hotel.longitude,
        latitude: hotel.latitude,
        dropImage: hotel.dropImage,
      },
      geometry: {
        type: 'Point',
        coordinates: [hotel.longitude, hotel.latitude],
      },
    }));
    setPoints(updatedPoints);
  }, [hotels]);

 // ... (Previous code remains unchanged)

  useEffect(() => {
    superCluster.load(points);
    const newClusters: PointFeature[] = superCluster.getClusters(bounds as any, zoom) as PointFeature[];
    setClusters(newClusters);
  }, [points, zoom, bounds]);


  useEffect(() => {
    if (mapRef?.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat());
    }
  }, [mapRef?.current]);

  return (
    <Box
      sx={{
        height: 400,
        position: 'relative',
      }}
    >
      <ReactMapGL
        initialViewState={{ latitude: 11, longitude: 76, zoom: 0 }}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN as string}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        ref={mapRef}
        onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom as number))}
      >
        <GeolocateControl position='top-left'
        trackUserLocation
        onGeolocate={(e) => dispatch(updateLocation({ longitude: e.coords.longitude, latitude: e.coords.latitude}))}
        /> 
        {clusters.map((cluster) => {
          const { cluster: isCluster, point_count } = cluster.properties as any;
          const [longitude, latitude] = cluster.geometry.coordinates;
          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                longitude={longitude}
                latitude={latitude}
              >
                <div className="cluster-marker" style={{
                  width:`${10+(point_count/points.length)*20}px`,
                  height:`${10+(point_count/points.length)*20}px`
                }}
                onClick={() => {
                  const zoom = Math.min(superCluster.getClusterExpansionZoom(Number(cluster.id)),20)
                  mapRef?.current?.flyTo({
                    center:[longitude,latitude],
                    zoom,
                    speed:1
                  })
                }}
                > 
                {point_count}
                </div>

              </Marker>
            );
          }

          return (
            <Marker
                key={`hotel-${cluster.properties.hotelId}`}
                longitude={longitude}
                latitude={latitude}
            >
              <Tooltip title={cluster.properties.hotelName}>
                <Avatar
                src={cluster.properties.dropImage}
                component={Paper}
                elevation={2}
                />
              </Tooltip>
            </Marker>
          )
        })}
      </ReactMapGL>
    </Box>
  );
};

export default MapScreen;
