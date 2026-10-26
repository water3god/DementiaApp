"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState, useTransition } from "react";
import L from "leaflet";
import { MapPinPlus, Trash2 } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import EditDialog, { AddButton } from "@/components/editDialog";
import Field from "@/components/field";
import { addPlace, deletePlace } from "@/app/actions/places";
import type { Place } from "@/lib/data/places";

const pin = L.divIcon({
  className: "",
  html: '<div class="size-4 rounded-full bg-primary ring-4 ring-primary/30"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const draftPin = L.divIcon({
  className: "",
  html: '<div class="size-4 animate-pulse rounded-full bg-primary/60 ring-4 ring-primary/30"></div>',
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

function ClickToPlace({ onPlace }: { onPlace: (latlng: L.LatLng) => void }) {
  useMapEvents({ click: (event) => onPlace(event.latlng) });
  return null;
}

function DeletePlaceButton({ place }: { place: Place }) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function handleClick() {
    if (!armed) return setArmed(true);
    startTransition(async () => {
      const result = await deletePlace(place.id).catch(() => ({ error: "Could not delete. Please try again." }));
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mt-2 flex flex-col gap-1">
      <Button variant="destructive" size="sm" disabled={pending} onClick={handleClick}>
        <Trash2 data-icon="inline-start" />
        {armed ? "Tap again to delete" : "Delete place"}
      </Button>
      {error && <span className="text-destructive">{error}</span>}
    </div>
  );
}

// Pass patientId (caretaker view) to add an "Add a place" button and a delete button in each popup.
export default function WorldMap({
  places,
  patientId,
}: {
  places: Place[];
  patientId?: string;
}) {
  const editable = patientId !== undefined;
  const [placing, setPlacing] = useState(false);
  const [draft, setDraft] = useState<L.LatLng | null>(null);

  function finishPlacing() {
    setPlacing(false);
    setDraft(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={placing && !draft ? "[&_.leaflet-container]:cursor-crosshair!" : undefined}>
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
                {editable && <DeletePlaceButton place={place} />}
              </Popup>
            </Marker>
          ))}
          {placing && !draft && <ClickToPlace onPlace={setDraft} />}
          {draft && <Marker position={draft} icon={draftPin} />}
        </MapContainer>
      </div>

      {editable && (
        <>
          {placing ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2">
              <span className="text-sm text-muted-foreground">
                Tap the map to drop a pin.
              </span>
              <Button variant="ghost" size="sm" onClick={finishPlacing}>
                Cancel
              </Button>
            </div>
          ) : (
            <AddButton onClick={() => setPlacing(true)}>
              <MapPinPlus data-icon="inline-start" />
              Add a place
            </AddButton>
          )}
          <EditDialog
            open={draft !== null}
            onOpenChange={(open) => !open && finishPlacing()}
            title="Add a place"
            submitLabel="Add place"
            onSubmit={(formData) => addPlace(patientId!, draft!.lat, draft!.lng, formData)}
          >
            <Field id="name" label="Name" placeholder="Maggie's house" required autoFocus />
            <Field
              id="description"
              label="Description"
              multiline
              placeholder="Your daughter lives here"
            />
          </EditDialog>
        </>
      )}
    </div>
  );
}
