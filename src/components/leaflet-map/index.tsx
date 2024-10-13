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
export const LeafletMap = component$<MapProps>(
  ({ location, popups }: MapProps) => {
    //const data = useAuthSession();

    // Modify with your preferences. By default take all screen

    useStyles$(
      `   .my-app {
                #map {
                  border-radius: 1rem;
                  width: 100%;
                    }
                  @media (max-width: 768px) {
                      #map {
                        border-radius: 5px;
                        width: 100%;
                      }
                      color: red;
                      }
                    }
                    .my-profile {
                  #map {
                        border-radius: 10px;
                        width: 100%;
                        height: 59em;
                        }
                      @media (max-width: 768px) {
                      #map {
                      border-radius: 5px;
                      width: 100%;
                    }
                    color: red;
                  }
                                    }
  `,
    );

    const mapContainer$ = useSignal<Map>();
    //eslint-disable-next-line
    useVisibleTask$(async ({ track }) => {
      //@ts-ignore
      track(location);
      const { tileLayer, marker, Icon, Popup } = await import("leaflet");

      const baseIcon = new Icon({
        iconUrl: "/marker-icon.png",
      });
      const { getBoundaryBox } = await import("../../helpers/boundary-box");

      if (mapContainer$.value) {
        mapContainer$.value.remove();
      }
      //@ts-ignore
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

      popups?.value.map((pop) => {
        console.log(pop);
        const popup = new Popup({}).setLatLng([...pop.coords]).setContent(`
          <div  class="popup-content bg-white rounded shadow-sm p-3 max-w-xs">
            <h3 class="popup-title text-base font-medium text-gray-800 mb-1">${pop.name}</h3>
            <p class="popup-description text-xs text-gray-600 mb-2">${pop.description || "No description available"}</p>
            <a href="${pop.link || "#"}" class="popup-link text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          `);

        locationData.marker &&
          marker(pop.coords, { icon: baseIcon, bubblingMouseEvents: true })
            .bindPopup(popup)
            .addTo(map);
      });
    });
    return (
      <div
        id="map"
        class="h-[27em] border shadow-md lg:h-[59em]  2xl:h-[64em]"
      ></div>
    );
  },
);
