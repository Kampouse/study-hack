import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export type EventCardProps = {
  title: string;
  description: string;
  time: string;
  tags: string[];
  placeID: number;
  image: string;
  attendees: number;
  link: string;
  status?: string;
  host?: boolean;
};

export const EmptyEventCard = component$(() => {
  return (
    <article class="flex w-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] md:block lg:w-full [&:nth-child(n+4)]:hidden md:[&:nth-child(n+4)]:block">
      <header class="relative flex w-full flex-col items-center  justify-center overflow-hidden rounded-xl px-14 py-10 lg:aspect-[1.8] xl:aspect-[2.3] 2xl:aspect-[2.35]">
        <div class="size-full absolute inset-0 animate-pulse bg-gray-200"></div>
      </header>
      <div class="mt-2.5 flex w-full flex-col font-medium text-neutral-400">
        <div class="h-4 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
        <div class="mt-1.5 h-3 w-full animate-pulse rounded-md bg-gray-200"></div>
        <div class="mt-1.5 h-3 w-1/2 animate-pulse rounded-md bg-gray-200"></div>
      </div>
      <div class="mt-2.5 flex w-full items-start gap-2.5">
        <div class="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
        <div class="h-6 w-16 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    </article>
  );
});

export const EventCard = component$((props: EventCardProps) => {
  return (

    <div class=" overflow-hidden rounded-2xl bg-white  p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] md:block ">
      <article
        id={"#" + props.title}
        class="flex flex-col overflow-hidden rounded-2xl  p-4  md:block h-[19em]"
      >
        <header class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
          <div class="aspect-[16/9] w-full">
            <img
              loading="lazy"
              src={
                props.image
                  ? props.image
                  : "https://i.pinimg.com/736x/48/af/17/48af17868bea2ebf4f332e1145d66e16.jpg"
              }
              onError$={(event) => {
                const target = event.target as HTMLImageElement;
                target.src =
                  "https://i.pinimg.com/736x/48/af/17/48af17868bea2ebf4f332e1145d66e16.jpg";
              }}
              class="size-full absolute inset-0 object-cover"
              alt=""
              width={500}
              height={500}
            />
          </div>

          <div class="absolute bottom-2 left-2 rounded-lg bg-white bg-opacity-60 px-2 py-1 text-xs font-medium text-gray-800">
            <div class="group relative">
              <Link
                href={`/places/${props.placeID}`}
                class="flex items-center gap-2 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-colors duration-300 group-hover:stroke-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>
        <div class="flex flex-col  ">

          <div class="flex flex-row gap-2 pt-3">
            <h1 class="flex items-center gap-2 text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{props.attendees + (props.host ? 0 : 1)}</span>
            </h1>
            <h1 class="flex items-center gap-2 text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{props.time}</span>
            </h1>
          </div>
          <div class="flex items-center gap-2 py-2">
            <h1 class="font-medium truncate">{props.title}</h1>
            {props.status == "host" ? (
              <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 whitespace-nowrap">
                Host
              </span>
            ) : (
              <div class="h-full">
                <div>
                  {props.status && (
                    <span
                      class={`rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${props.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                        }`}
                    >
                      {props.status === "pending" ? "Pending" : "Confirmed"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <p class="text-sm text-gray-600 line-clamp-2">
            {props.description}
          </p>


        </div>


      </article>
      <Link
        href={`${props.link}`}
        class="flex w-full items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 align-self-end"
      >
        See Event
      </Link>
    </div>
  );
});
