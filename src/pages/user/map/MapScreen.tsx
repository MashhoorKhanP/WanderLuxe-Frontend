import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/types";
import { getHotels } from "../../../actions/hotel";
import { AppDispatch } from "../../../store/store";
import ReactMapGL, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { AppBar, Avatar, Box, Paper, Tooltip, Typography } from "@mui/material";
import SuperCluster from "supercluster";
import "./cluster.css";
import { useValue } from "../../../context/ContextProvider";

import PopupHotel from "./PopupHotel";
import PriceSlider from "../../../components/user/searchbar/PriceSlider";
import GeocoderInput from "../../../components/user/searchbar/GeocoderInput";
import "./cluster.css";
import RouteInstructions from "./RouteInstructions";
import { updateLocation } from "../../../store/slices/adminSlices/adminHotelSlice";

interface Hotel {
  _id: string;
  hotelName: string;
  minimumRent: number;
  description: string;
  images: string[];
  longitude: number;
  latitude: number;
  dropImage: string;
}

interface PointFeature {
  type: "Feature";
  properties: {
    cluster: boolean;
    hotelId: string;
    hotelName: string;
    minimumRent: number;
    description: string;
    hotelImages: string[];
    longitude: number;
    latitude: number;
    dropImage: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  id?: string;
}

const superCluster = new SuperCluster({
  radius: 75,
  maxZoom: 20,
});

const MapScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hotels = useSelector((state: RootState) => state.user.filteredHotels);
  const { mapRef } = useValue();
  const location = useSelector((state: RootState) => state.adminHotel.hotelLocation);
  const [popupInfo, setPopupInfo] = useState<PointFeature | null>(null);
  const [points, setPoints] = useState<PointFeature[]>([]);
  const [clusters, setClusters] = useState<PointFeature[]>([]);
  const [bounds, setBounds] = useState<number[]>([
    -180, -85, 180, 85,
  ] as number[]);
  const [zoom, setZoom] = useState<number>(0);
  const [start, setStart] = useState<number[]>([0, 0]);
  const [end, setEnd] = useState<number[]>([0, 0]);
  const [coords, setCoords] = useState<number[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [routeInstructions, setRouteInstructions] = useState<string[]>([]);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v12"
  );
  useEffect(() => {
    const updatedPoints: PointFeature[] = hotels.map((hotel: Hotel) => ({
      type: "Feature",
      properties: {
        cluster: false,
        hotelId: hotel._id,
        hotelName: hotel.hotelName,
        minimumRent: hotel.minimumRent,
        description: hotel.description,
        hotelImages: hotel.images,
        longitude: hotel.longitude,
        latitude: hotel.latitude,
        dropImage: hotel.dropImage,
      },
      geometry: {
        type: "Point",
        coordinates: [hotel.longitude, hotel.latitude],
      },
    }));
    setPoints(updatedPoints);
  }, [hotels, GeocoderInput]);

  // ... (Previous code remains unchanged)
  useEffect(() => {
    const currentTime = new Date().getHours();

    // Set the map style based on the current time
    if (currentTime >= 19) {
      // 7pm in 24-hour format
      setMapStyle("mapbox://styles/mapbox/navigation-night-v1");
    } else {
      setMapStyle("mapbox://styles/mapbox/streets-v12");
    }
  }, []);

  useEffect(() => {
    superCluster.load(points);
    const newClusters: PointFeature[] = superCluster.getClusters(
      bounds as any,
      zoom
    ) as PointFeature[];
    setClusters(newClusters);
  }, [points, zoom, bounds, start, end, setEnd, setStart]);

  useEffect(() => {
    if (mapRef?.current) {
      setBounds(mapRef.current.getMap().getBounds().toArray().flat());
    }
  }, [mapRef?.current]);

  //Map Direction

  useEffect(() => {
    getRoute();
  }, [start, end]);

  useEffect(() => {
    dispatch(getHotels());
  }, []);

  const getRoute = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${
          start[0]
        },${start[1]};${end[0]},${
          end[1]
        }?alternatives=false&exclude=toll&geometries=geojson&language=en&overview=full&steps=true&access_token=${
          import.meta.env.VITE_MAPBOX_TOKEN as string
        }`
      );

      if (!response.ok) {
        // Handle non-OK responses
        console.error("Error:", response.status, response.statusText);
        const errorData = await response.json(); // Try to get more details from the error response
        console.error("Error Data:", errorData);
        return;
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates;
        setCoords(coords);
        const calculatedDistance = data.routes[0].distance / 1000; // Convert meters to kilometers
        setDistance(calculatedDistance);

        const instructions = data.routes[0].legs.reduce(
          (acc: any, leg: any) => acc.concat(leg.steps),
          []
        );
        const stepInstructions = instructions.map(
          (step: any) => step.maneuver.instruction
        );
        setRouteInstructions(stepInstructions);
      } else {
        console.error("No route found in the response:", data);
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const geojson: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  const lineStyle: any = {
    id: "roadLayer",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };

  const endPoint: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "Point",
          coordinates: [...end],
        },
      },
    ],
  };

  const layerEndPoint: any = {
    id: "end",
    type: "marker",
    source: {
      type: "geojson",
      data: end,
    },
    paint: {
      "circle-radius": 5,
      "circle-color": "#f30",
    },
  };

  const handleClick = (e: any) => {
    const newEnd = e.lngLat;
    const endPoint = Object.keys(newEnd).map((item, i) => newEnd[item]);
    setEnd(endPoint);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "400px",
        }}
        className="box-react-mapgl"
      >
        <ReactMapGL
          onClick={handleClick}
          style={{ width: "100vw", height: "400px" }}
          initialViewState={{ latitude: 11, longitude: 76, zoom: 3 }}
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN as string}
          mapStyle={mapStyle}
          ref={mapRef}
          onZoomEnd={(e) => setZoom(Math.round(e.viewState.zoom as number))}
        >
          <GeolocateControl
            showAccuracyCircle={false}
            position="top-left"
            trackUserLocation
            onGeolocate={(e) =>
              dispatch(
                updateLocation({
                  longitude: e.coords.longitude,
                  latitude: e.coords.latitude,
                })
              ) && setStart([e.coords.longitude, e.coords.latitude])
            }
          />

          {/* Map Direction Start */}
          <Source id="routeSource" type="geojson" data={geojson}>
            <Layer {...lineStyle} />
          </Source>

          <Source id="endSource" type="geojson" data={endPoint}>
            <Layer {...layerEndPoint} />
          </Source>
          {distance !== null && (
            <div
              style={{
                position: "absolute",
                top: 50,
                left: 50,
                backgroundColor: "white",
                padding: "5px",
                borderRadius: "5px",
                zIndex: 1,
              }}
            >
              Distance: {distance.toFixed(2)}km
            </div>
          )}
          {routeInstructions.length && (
            <RouteInstructions routeInstructions={routeInstructions} />
          )}
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          {/* <Marker longitude={start[0]} latitude={start[1]}/> */}

          {clusters.map((cluster) => {
            const { cluster: isCluster, point_count } =
              cluster.properties as any;
            const [longitude, latitude] = cluster.geometry.coordinates;
            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  longitude={longitude}
                  latitude={latitude}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${10 + (point_count / points.length) * 20}px`,
                      height: `${10 + (point_count / points.length) * 20}px`,
                    }}
                    onClick={() => {
                      const zoom = Math.min(
                        superCluster.getClusterExpansionZoom(
                          Number(cluster.id)
                        ),
                        20
                      );
                      mapRef?.current?.flyTo({
                        center: [longitude, latitude],
                        zoom,
                        speed: 1,
                      });
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
                    onClick={(e) => {
                      setPopupInfo(cluster);
                      handleClick(e);
                    }}
                  />
                </Tooltip>
              </Marker>
            );
          })}
          <PriceSlider />
          <GeocoderInput />
          {popupInfo && (
            <Popup
              longitude={popupInfo.geometry.coordinates[0]}
              latitude={popupInfo.geometry.coordinates[1]}
              maxWidth="auto"
              closeOnClick={false}
              focusAfterOpen={false}
              onClose={() => setPopupInfo(null)}
            >
              <PopupHotel
                {...{ popupInfo }}
                distance={distance?.toFixed(2) || ""}
              />
            </Popup>
          )}
        </ReactMapGL>
      </Box>
    </>
  );
};

export default MapScreen;
