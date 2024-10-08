/**
 * This code was generated by Builder.io.
 */
import { component$ } from "@builder.io/qwik";

interface TagProps {
  text: string;
}

export const Tag = component$((props: TagProps) => {
  return (
    <div class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-200">
      {props.text}
    </div>
  );
});
