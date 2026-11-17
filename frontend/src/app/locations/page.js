

import { getLocations } from "@/lib/serverApi";
import LocationsClient from "./LocationsClient";

export default async function LocationsPage() {
  let locations = [];

  try {
    const res = await getLocations();
    locations = res?.data || [];
  } catch (error) {
    console.error("Failed to load locations:", error);
  }

  return <LocationsClient locations={locations} />;
}
