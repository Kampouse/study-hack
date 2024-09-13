import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import * as Icons from "lucide-qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const location = useLocation();
  return (
    <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div class="rounded-lg bg-white p-8 text-center shadow-md">
        <Icons.CheckCircleIcon class="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 class="mb-4 text-3xl font-bold text-gray-800">Success!</h1>
        <p class="mb-6 text-gray-600">
          You have successfully Created the event.
        </p>
        <div class="flex flex-col space-y-4">
          <Link
            href="/home"
            class="rounded-md bg-blue-500 px-6 py-2 text-white transition duration-300 hover:bg-blue-600"
          >
            Back to Home
          </Link>
          <button
            onClick$={() => {
              const eventUrl = ` ${window.location.origin}/join/${location.params.id}`;
              navigator.clipboard.writeText(eventUrl).then(
                () => {
                  // #TODO: Show a toast message or something
                },
                (err) => {
                  console.error("Could not copy text: ", err);
                },
              );
            }}
            class="flex items-center justify-center rounded-md bg-green-500 px-6 py-2 text-white transition duration-300 hover:bg-green-600"
          >
            <Icons.Share2Icon class="mr-2 h-5 w-5" />
            Share Event
          </button>
        </div>
      </div>
    </div>
  );
});
