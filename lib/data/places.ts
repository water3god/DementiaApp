/* delete later */
export type Place = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

const places: Place[] = [
  {
    id: "1",
    name: "Home",
    description: "Where you live",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: "2",
    name: "Maggie's house",
    description: "Your daughter lives here",
    lat: 40.73,
    lng: -73.99,
  },
  {
    id: "3",
    name: "Central Park",
    description: "Where you like to walk",
    lat: 40.7829,
    lng: -73.9654,
  },
];

export async function getPlaces(): Promise<Place[]> {
  return places;
}
