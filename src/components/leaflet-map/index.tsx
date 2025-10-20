import {
  component$,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from '@builder.io/qwik'
import { Map } from 'leaflet'
import type { MapProps } from '~/models/map'
import MapWrapper from './map'
export { MapWrapper }
export const LeafletMap = component$<MapProps>(
  ({ location, events, places }: MapProps) => {
    //const data = useAuthSession();
    // Modify with your preferences. By default take all screen

    useStyles$(
      `   .my-app {
                #map {
                  border-radius: 1rem;
                  width: 100%;
                  height: calc(100vh - 160px);
                  min-height: 400px;
                  max-height: 800px;
                }
                @media (max-width: 768px) {
                  #map {
                    border-radius: 5px;
                    width: 100%;
                    height: calc(100vh - 120px);
                    min-height: 300px;
                  }
                }
              }
              .my-profile {
                #map {
                  border-radius: 10px;
                  width: 100%;
                  height: 100%;
                  min-height: 500px;
                  max-height: 1000px;
                }
                @media (max-width: 768px) {
                  #map {
                    border-radius: 5px;
                    width: 100%;
                    height: calc(100vh - 80px);
                    min-height: 400px;
                  }
                }
              }
  `
    )

    const mapContainer$ = useSignal<Map>()
    //eslint-disable-next-line
    useVisibleTask$(async ({ track }) => {
      //@ts-ignore
      track(location)
      const { tileLayer, marker, Icon, Popup } = await import('leaflet')

      const baseIcon = new Icon({
        iconSize: [25, 41],
        className: 'w-2 h-2',
        iconUrl: '/marker-icon.png',
        zIndexOffset: 1000, // Ensure base icons stay on top
      })

      const placeIcon = new Icon({
        iconUrl: '/redpin.png',
        iconSize: [45, 45],
        className: 'w-[100px] h-[200px] rotate-[75deg]',
        crossOrigin: true,
      })

      const { getBoundaryBox } = await import('../../helpers/boundary-box')

      if (mapContainer$.value) {
        mapContainer$.value.remove()
      }
      //@ts-ignore
      const { value: locationData } = location

      const centerPosition: [number, number] = locationData.point as [
        number,
        number,
      ]

      const map = new Map('map').setView(
        centerPosition,
        locationData.zoom || 14,
        {}
      )

      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        crossOrigin: true,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">hi</a>',
      }).addTo(map)

      // Assign select boundary box to use in OSM API if you want
      locationData.boundaryBox = getBoundaryBox(map)
      places?.value?.map(data => {
        if (!data) return
        const popup = new Popup({})
          .setLatLng([data.coords[0], data.coords[1]])
          .setContent(`
          <div class="popup-content bg-white rounded shadow-sm max-w-xs">
            <h3 class="popup-title text-base font-medium text-gray-800 mb-1">${data.name} place </h3>
            <p class="popup-address text-xs text-gray-500 mb-2">${data.description}</p>
            <p class="popup-description text-xs text-gray-600 mb-2">${data.place || 'No description available'}</p>
            <a href="${data.link || '#'}" class="popup-link text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        `)

        locationData.marker &&
          marker([...data.coords], {
            icon: placeIcon,
            bubblingMouseEvents: true,
          })
            .bindPopup(popup)
            .addTo(map)
      })

      events?.value.map(pop => {
        const popup = new Popup({}).setLatLng([...pop.coords]).setContent(`
          <div class="popup-content bg-white rounded shadow-sm max-w-xs">
            <h3 class="popup-title text-base font-medium text-gray-800 mb-1">${pop.name}</h3>
            <p class="popup-address text-xs text-gray-500 mb-2">${pop.description}</p>
            <p class="popup-description text-xs text-gray-600 mb-2">${pop.place || 'No description available'}</p>
            <a href="${pop.link || '#'}" class="popup-link text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center">
              Learn more
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        `)

        locationData.marker &&
          marker(pop.coords, { icon: baseIcon, bubblingMouseEvents: true })
            .bindPopup(popup)
            .addTo(map)
      })
    })
    return <div id="map" class="h-[100em]"></div>
  }
)
