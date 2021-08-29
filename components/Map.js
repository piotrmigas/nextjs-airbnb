import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { getCenter } from "geolib";
import Image from "next/image";
import { HeartIcon as HeartOutline } from "@heroicons/react/outline";
import { HeartIcon as HeartSolid, StarIcon } from "@heroicons/react/solid";
import { useDispatch } from "../context";

const Map = ({ searchResults }) => {
  const dispatch = useDispatch();

  const [selectedLocation, setSelectedLocation] = useState({});

  const coordinates = searchResults.map((result) => ({ longitude: result.long, latitude: result.lat }));

  const center = getCenter(coordinates);

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11,
  });

  return (
    <ReactMapGL
      mapStyle="mapbox://styles/piotrmigas/cksa6lvly02dz18ntvykt9lmh"
      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX}
      {...viewport}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {searchResults.map((result) => (
        <div key={result.long}>
          <Marker longitude={result.long} latitude={result.lat} offsetLeft={-20} offsetTop={-10}>
            <p
              role="img"
              aria-label="pin-push"
              onClick={() => setSelectedLocation(result)}
              className="text-2xl cursor-pointer animate-bounce"
            >
              📌
            </p>
          </Marker>
          {selectedLocation.long === result.long ? (
            <Popup
              className="z-30"
              closeButton={false}
              onClose={() => setSelectedLocation({})}
              latitude={result.lat}
              longitude={result.long}
              closeOnClick={false}
            >
              <div className="max-w-[150px]">
                <div className="relative">
                  <Image
                    src={selectedLocation.img}
                    width={150}
                    height={100}
                    alt=""
                    objectFit="cover"
                    className="block"
                  />
                  {!result.liked ? (
                    <HeartOutline
                      className="absolute top-1 right-1 h-6 text-white"
                      onClick={() => dispatch("LIKE", selectedLocation.id)}
                    />
                  ) : (
                    <HeartSolid
                      className="absolute top-1 right-1 h-6 text-red-400"
                      onClick={() => dispatch("LIKE", selectedLocation.id)}
                    />
                  )}
                </div>
                <p className="flex items-center">
                  <StarIcon className="h-5 text-red-400 pr-1" />
                  {selectedLocation.star}
                </p>
                <p>{result.title}</p>
              </div>
            </Popup>
          ) : (
            false
          )}
        </div>
      ))}
    </ReactMapGL>
  );
};

export default Map;
