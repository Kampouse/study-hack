import { component$, useStyles$, useSignal, useTask$ } from "@builder.io/qwik";
import leafletStyles from "../../../node_modules/leaflet/dist/leaflet.css?inline";
import type { LocationsProps } from "~/models/location";
import { LeafletMap } from "./index";

import type { MapProps } from "~/models/map";
import { useLocation } from "@builder.io/qwik-city";

export default component$<MapProps>((props) => {
  useStyles$(leafletStyles);
  // todo make this dynamic
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
  const styled = useSignal<string>("my-app");
  const location = useLocation();
  useTask$(() => {
    if (location.url.pathname.includes("profile")) {
      styled.value = "my-profile";
    } else {
      styled.value = "my-app";
    }
  });
  return (
    <div class={styled}>
      <LeafletMap popups={props.popups} location={currentLocation} />
    </div>
  );
});
