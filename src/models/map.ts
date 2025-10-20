import type { Signal } from '@builder.io/qwik'
import type { LocationsProps } from './location'

export type popupsData = Array<{
  name: string
  link: string
  description: string
  date: string
  place: string | undefined
  coords: [number, number]
}>

export type Place =
  | {
      name: string
      Image: string
      link: string
      coords: [number, number]
      description: string
      place: string
    }
  | undefined

export type MapProps = {
  // default options
  location?: Signal<LocationsProps>
  events?: Signal<popupsData>
  places?: Signal<Place[] | undefined>
}
