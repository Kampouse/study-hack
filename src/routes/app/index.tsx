import { component$ } from "@builder.io/qwik";
export default component$(() => {
  return (
    <div class=" flex h-full flex-col justify-start  p-12  ">
      <div class="pb-8">
        <h1 class="text-3xl font-medium">Community</h1>
        <p class="text-md pb- py-1 font-thin  text-black">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="grid grid-cols-5 gap-8">
        <div class="col-span-3 row-span-1 h-[30em] rounded-xl bg-green-400 pl-32"></div>
        <div class="col-span-2 row-span-1 rounded-xl bg-red-100"></div>
      </div>
    </div>
  );
});
