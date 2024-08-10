import { component$, Slot } from "@builder.io/qwik";

export interface ButtonProps {
  size?: "small" | "medium" | "large";
}
export const Button = component$<ButtonProps>(({ size = "medium" }) => {
  return (
    <button
      class="bg-red-900 rounded-full"
    >
      <Slot></Slot>
    </button>
  );
});
