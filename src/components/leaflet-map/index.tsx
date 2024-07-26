import {
  component$,
  noSerialize,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Map } from "leaflet";
import type { MapProps } from "~/models/map";

export const LeafletMap = component$<MapProps>(({ location }: MapProps) => {
  // Modify with your preferences. By default take all screen
  useStyles$(`
    #map {
               border-radius: 10px;
                width: 100%;
                height: 50em;
              }
      @media (max-width: 768px) {
          #map {
           border-radius: 0px;
            width: 100%;
            height: 25em;
          }
          color: red;
          height: 10px;
          }
  `);

  const mapContainer$ = useSignal<Map>();
  //eslint-disable-next-line
  useVisibleTask$(async ({ track }) => {
    track(location);

    const { tileLayer, marker } = await import("leaflet");

    const { getBoundaryBox } = await import("../../helpers/boundary-box");

    if (mapContainer$.value) {
      mapContainer$.value.remove();
    }

    const { value: locationData } = location;

    const centerPosition: [number, number] = locationData.point as [
      number,
      number,
    ];

    const map: any = new Map("map").setView(
      centerPosition,
      locationData.zoom || 14,
      {},
    );

    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">hi</a>',
    }).addTo(map);

    // Assign select boundary box to use in OSM API if you want
    locationData.boundaryBox = getBoundaryBox(map);

    locationData.marker &&
      marker(centerPosition).bindPopup(`Montreal, QC`).addTo(map);

    mapContainer$.value = noSerialize(map);
  });
  return <div id="map" class="shadow-md"></div>;
});
