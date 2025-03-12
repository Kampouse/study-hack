import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import * as Icons from "lucide-qwik";
import { useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const location = useLocation();
  return (
    <div class="container mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4">
      <div class="w-full max-w-lg rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 p-8 text-center shadow-sm transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/70 hover:shadow-md">
        <Icons.CheckCircleIcon class="mx-auto mb-6 h-20 w-20 text-green-500" />
        <h1 class="mb-4 text-3xl font-semibold tracking-tight text-gray-900">
          Success!
        </h1>
        <p class="mb-8 text-lg leading-relaxed text-gray-600">
          You have successfully created the event.
        </p>
        <div class="flex flex-col gap-4">
          <Link
            href="/home"
            class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-blue-700 active:scale-[0.98]"
          >
            <Icons.HomeIcon class="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <button
            onClick$={() => {
              const eventUrl = `${window.location.origin}/join/${location.params.id}`;
              navigator.clipboard.writeText(eventUrl).then(
                () => {
                  // #TODO: Show a toast message or something
                },
                (err) => {
                  console.error("Could not copy text: ", err);
                },
              );
            }}
            class="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-green-700 active:scale-[0.98]"
          >
            <Icons.Share2Icon class="mr-2 h-5 w-5" />
            Share Event
          </button>
        </div>
      </div>
    </div>
  );
});
