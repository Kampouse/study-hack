import { useAuthSignin } from "../plugin@auth";
import { component$ } from "@builder.io/qwik";

export default component$(() => {
  const signin = useAuthSignin();

  return (
    <div class=" bg-red-500 py-32">
      <button
        onClick$={() => {
          signin.submit({
            providerId: "github",
          });
        }}
      >
        Sign In
      </button>
    </div>
  );
});
