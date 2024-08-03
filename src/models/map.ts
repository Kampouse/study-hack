import type { LocationsProps } from "./location";
import { type Signal } from "@builder.io/qwik";

export type popupsData = Array<{
  name: string;
  coords: [number, number];
}>;

export type MapProps = {
  // default options
  location?: Signal<LocationsProps>;
  popups?: Signal<popupsData>;
};
