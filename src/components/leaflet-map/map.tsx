import { component$, useStyles$, useSignal } from "@builder.io/qwik";
import leafletStyles from "../../../node_modules/leaflet/dist/leaflet.css?inline";
import type { LocationsProps } from "~/models/location";
import { LeafletMap } from "./index";

type Location = {
  location?: LocationsProps;
};

export default component$<Location>((props) => {
  useStyles$(leafletStyles);
  const mapData = {
    name: "Montreal",
    point: [45.5017, -73.5673],
    boundaryBox: "45.4092,-73.9786,45.7065,-73.4747", // Example bounding box for Montreal
    zoom: 12,
    marker: true,
  } satisfies LocationsProps;
  if (props.location) {
    Object.assign(mapData, props.location);
  }

  const currentLocation = useSignal<LocationsProps>({
    ...mapData,
  });
  return (
    <div class="">
      <LeafletMap location={currentLocation} />
    </div>
  );
});
