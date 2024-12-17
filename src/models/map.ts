import type { LocationsProps } from "./location";
import { type Signal } from "@qwik.dev/core";

export type popupsData = Array<{
  name: string;
  link: string;
  description: string;
  date: string;
  place: string | undefined;
  coords: [number, number];
}>;

export type MapProps = {
  // default options
  location?: Signal<LocationsProps>;
  popups?: Signal<popupsData>;
};
