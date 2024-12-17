import { component$, Slot } from "@qwik.dev/core";

export interface ButtonProps {
  size?: "small" | "medium" | "large";
}
export const Button = component$<ButtonProps>(({ size = "medium" }) => {
  return (
    <button class={"rounded-full bg-red-900 " + size}>
      <Slot></Slot>
    </button>
  );
});
