import { component$ } from "@builder.io/qwik";




const UserCards = component$(() => {
  return (<div class="flex py-8 px px-8 rounded-xl  content-center w-full bg-red-50  ">
    <div class="flex flex-row gap-5">
      <img height={60} width={60} src="https://s6.imgcdn.dev/LyfCg.jpg" />
      <div>
        <h1 class="font-medium">@Kampouse</h1>
        <h1 class="font-normal">studying because  i can</h1>
        <h1 class="font-extralight">
          1pm - 2pm - Banq (the library)
        </h1>
      </div>
    </div>
  </div>)
});


export default component$(() => {
  return (
    <div class=" flex h-full flex-col justify-start  md:p-12  ">
      <div class="pb-8">
        <h1 class="text-3xl font-medium">Community</h1>
        <p class="text-md pb- py-1 font-thin  text-black">
          {" "}
          See who active this week
        </p>
      </div>
      <div class="md:grid flex flex-col grid-cols-5 gap-8">
        <div class="md:col-span-3 row-span-1 h-[30em] p-4 rounded-xl bg-green-400 ">

          <div class="bg-green-300 h-full w-full">
          </div>



        </div>
        <div class="md:col-span-2 row-span-1 p-4 rounded-xl bg-red-100">
          <div class="flex flex-col  justify-start gap-5">

            <UserCards />
            <UserCards />
            <UserCards />









          </div>


        </div>
      </div>
    </div>
  );
});
