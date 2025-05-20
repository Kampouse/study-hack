import { component$ } from "@builder.io/qwik";

export const CommunitySection = component$(() => {
  return (
    <section class="mt-8 bg-[#F8EDE3] py-12">
      <div class="container px-4 md:px-6">
        <div class="rounded-2xl bg-white p-8 shadow-md">
          <div class="flex flex-col items-center gap-8 md:flex-row">
            <div class="md:w-1/3">
              <div class="overflow-hidden rounded-xl">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/017/458/891/large_2x/light-bulb-with-shining-light-cartoon-style-flat-style-hand-drawn-style-doodle-style-symbol-of-creativity-innovation-inspiration-invention-and-ideas-illustration-vector.jpg"
                  width={400}
                  height={300}
                  alt="Community suggestions"
                  class="h-56 w-56"
                />
              </div>
            </div>
            <div class="md:w-2/3">
              <h2 class="mb-3 text-2xl font-bold text-[#5B3E29]">
                Community Suggestions
              </h2>
              <p class="mb-6 text-[#6D5D4E]">
                Our platform is built by and for people who love cozy,
                productive spaces. Help us improve by sharing your ideas and
                feedback.
              </p>
              <div class="flex flex-wrap gap-4">
                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Suggest a Feature
                </button>
                <button
                  type="button"
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Share Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
