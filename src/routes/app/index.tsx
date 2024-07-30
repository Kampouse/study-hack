import { component$ } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "@/components/leaflet-map";
import { UserCards } from "@/components/cards";

export default component$(() => {
  const intrests = ["plant", "code", "working"];
  const location = ["montreal", "toronto", "vancouver"];

  const card = {
    name: "Kampi",
    description: "studying for cs-231",
    time: "1pm - 4pm",
    tags: ["python", "javascript", "study"],
  };

  return (
    <div class=" flex h-full flex-col justify-start   md:pb-12  ">
      <div class=" px-2 py-2  md:px-6 md:py-4  ">
        <h1 class="text-3xl font-medium ">Community</h1>
        <p class="text-md   font-thin  text-black"> See who active this week</p>
      </div>
      <div class="flex grid-cols-5 flex-col gap-5 md:gap-2 lg:grid">
        <div class="row-span-1 h-fit rounded-full  lg:col-span-3  lg:pl-4 ">
          <Leaflet />
          <div class=" px-2 pt-10 pb-4 ">
            <h1 class="py-2 text-2xl font-medium "> Intrests Filters</h1>
            <div class=" flex gap-2 ">
              {intrests.map((intrest) => (
                <button
                  key={intrest}
                  class=" max-w-lg self-end rounded-md border bg-blue-50 p-2  text-black shadow-sm  "
                >
                  {intrest}
                </button>
              ))}
            </div>
          </div>
          <div class=" px-2 pt-2 ">
            <h1 class=" text-2xl font-medium pb-4 ">Good locations</h1>
            <div class=" flex  flex-col content-center md:flex-row md:gap-40 gap-8 w-full  ">
              {location.map((location) => (
                <div key={location} class="flex flex-col  min-w-fit md:w-[25em] gap-2  ">
                  <img src="https://s3.ca-central-1.amazonaws.com/files.quartierdesspectacles.com/lieux/esplanade-tranquille/2022/printemps/esplanade-tranquille-pqds-2022-esplanade-tranquille-printemps-ete-c-vivien-gaumand-20-390x260.jpg" alt="location" width={500} height={100} class=" max-w-screen-md h-full   rounded-md shadow-lg" />
                  <div class="flex flex-col  gap-2  bg-blue-50 pl-2   bg-opacity-30 align-middle w-full ">
                    <p class="text-md font-thin    text-black  ">

                      <span class="font-medium"> {location} </span> open 24/7</p>
                    <p class=" text-md font-thin  text-black ">a cozy spot where people dont bother your for coffee   </p>
                    <button class=" cursor-pointer max-w-lg self-start rounded-md border bg-blue-50 p-2  text-black shadow-sm  ">
                      book now
                    </button>

                  </div>

                </div>

              ))}
            </div>
          </div>
        </div>
        <div class="row-span-1 rounded-xl    lg:col-span-2 ">
          <div class="flex h-full  flex-col justify-start gap-4 px-2 py-1">
            <UserCards user={card} />
            <UserCards />
            <UserCards />
          </div>
        </div>
      </div>
    </div>
  );
});
