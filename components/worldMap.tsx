"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Place } from "@/lib/data/places";

const pin = L.divIcon({
  className: "",
  html: '<div class="size-4 rounded-full bg-primary ring-4 ring-primary/30"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const userPin = L.divIcon({
  className: "",
  html: '<div class="size-5 rounded-full border-2 border-white bg-blue-500 shadow-md ring-8 ring-blue-500/25"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function LocateUser() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const latlng: [number, number] = [coords.latitude, coords.longitude];
        setPosition(latlng);
        map.setView(latlng, 13);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [map]);

  if (!position) return null;
  return (
    <Marker position={position} icon={userPin} zIndexOffset={1000}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function WorldMap({ places }: { places: Place[] }) {
  return (
    <MapContainer
      center={[40.75, -73.98]}
      zoom={11}
      minZoom={2}
      worldCopyJump
      scrollWheelZoom={false}
      maxBounds={[
        [-90, -Infinity],
        [90, Infinity],
      ]}
      className="z-0 h-96 w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocateUser />
      {places.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lng]} icon={pin}>
          <Popup>
            <strong>{place.name}</strong>
            <br />
            {place.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
