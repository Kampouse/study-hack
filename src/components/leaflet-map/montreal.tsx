import { component$, useStyles$, useSignal } from "@builder.io/qwik";

// Leaflet map styles
import leafletStyles from "../../../node_modules/leaflet/dist/leaflet.css?inline";

import { LeafletMap } from "./index";
import type { LocationsProps } from "~/models/location";

export default component$(() => {
  useStyles$(leafletStyles);
  const currentLocation = useSignal<LocationsProps>({
    name: "Montreal",
    point: [45.5017, -73.5673],
    boundaryBox: "45.4092,-73.9786,45.7065,-73.4747", // Example bounding box for Montreal
    zoom: 12,
    marker: true,
  });
  return (
    <div class="">
      <LeafletMap location={currentLocation} />{" "}
    </div>
  );
});
