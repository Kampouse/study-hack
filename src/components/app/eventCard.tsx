import { component$, $ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

type EventCardProps = {
  eventId: number;
  data?: {
    name: string;
    description: string;
    tags: string[];
    starttime: string;
    endttime?: string;
    image: string | null;
  };
};
export const EventCard = component$<EventCardProps>((props) => {
  const defaultUserCard = {
    name: "Kampouse",
    description: "studying for cs-231",
    starttime: "1pm",
    tags: ["python", "javascript", "study"],
    eventId: 1,
    image:
      "https://images.unsplash.com/photo-1629910190000-4b3b3b3b3b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMjIwNzV8MHwxfGFsbHwxf",
  };

  const user = props.data || defaultUserCard;
  const onFocused = $(() => {
    console.log("focused");
  });
  console.log("event card", props.eventId);
  return (
    <div
      id={user.name}
      onScroll$={onFocused}
      class="px flex w-full content-center rounded-xl border  px-4  py-2 shadow-md md:p-8 md:pb-0 "
    >
      <div class="">
        <div class=" flex w-full flex-col">
          <div class="flex h-20 flex-row gap-4">
            <img
              height={75}
              width={75}
              class=" self-start"
              src={user.image ?? defaultUserCard.image}
            />
            <div class="flex flex-col gap-1 self-center  ">
              <h1 class="self-start font-bold">{user.name}</h1>
              <h1 class="font-semibol  self-start">{user.description}</h1>
              <h1 class="self-start  font-light">{user.starttime}</h1>
            </div>
          </div>

          <div class="flex flex-row justify-start  gap-2   pt-4 ">
            <Link
              href={`/join/${props.eventId}`}
              class="p-fit rounded-md border bg-green-400 px-4 py-2 font-medium text-black transition hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Join event
            </Link>

            {user.tags.map((tag) => {
              return (
                <h1
                  key={tag}
                  class="max-w-lg self-end rounded-md border bg-blue-50 p-2  text-black shadow-sm  "
                >
                  {tag}
                </h1>
              );
            })}
          </div>

          <div class="flex flex-row justify-end  gap-2 py-2 "></div>
        </div>
      </div>
    </div>
  );
});
