import type { Map as LeafletMap } from 'leaflet'
export const getBoundaryBox = (map: LeafletMap) => {
  const northEast = map.getBounds().getNorthEast()
  const southWest = map.getBounds().getSouthWest()
  return `${southWest.lat},${southWest.lng},${northEast.lat},${northEast.lng}`
}
