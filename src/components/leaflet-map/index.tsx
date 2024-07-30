import {
  component$,
  noSerialize,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Map } from "leaflet";
import type { MapProps } from "~/models/map";
import MapWrapper from "./map";
export { MapWrapper };
import { useAuthSession } from "~/routes/plugin@auth";
export const LeafletMap = component$<MapProps>(({ location }: MapProps) => {
  const data = useAuthSession();
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
    const { tileLayer, marker, Icon, Popup } = await import("leaflet");

    const baseIcon = new Icon({
      iconUrl: "/marker-icon.png",
    });
    const { getBoundaryBox } = await import("../../helpers/boundary-box");

    if (mapContainer$.value) {
      mapContainer$.value.remove();
    }

    const { value: locationData } = location;

    const centerPosition: [number, number] = locationData.point as [
      number,
      number,
    ];

    const map = new Map("map").setView(
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

    const popup = new Popup({}).setLatLng(centerPosition)
      .setContent(` <a id="hack" class="w-full h-full bg-red-50"> hi am  ${data.value?.user?.name}

      </a>`);
    locationData.marker &&
      marker(centerPosition, { icon: baseIcon, bubblingMouseEvents: true })
        .bindPopup(popup)
        .addTo(map);
    map.on("popupclose", () => {
      document.querySelector("#Kampi")?.classList.remove("bg-red-50");
    });
    map.on("popupopen", () => {
      document.querySelector("#Kampi")?.classList.add("bg-red-50");
    });
    mapContainer$.value = noSerialize(map);
  });
  return <div id="map" class="shadow-md"></div>;
});
