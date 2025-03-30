import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export type EventCardProps = {
  title: string;
  description: string;
  time: string;
  tags: string[];
  placeID: number;
  placeName: string;
  image: string;
  attendees: number;
  link: string;
  status?: string;
  host?: boolean;
};

const StatusBadge = component$((props: { status: string }) => {
  return (
    <div class="h-full">
      {props.status === "host" ? (
        <span class="whitespace-nowrap rounded-full bg-blue-200 px-3 py-1 text-xs font-semibold text-blue-800 shadow-sm">
          Host
        </span>
      ) : (
        <div>
          {props.status && (
            <span
              class={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                props.status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {props.status === "pending" ? "Pending" : "Confirmed"}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export const EmptyEventCard = component$(() => {
  return (
    <article class="flex w-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg transition-all duration-300 hover:shadow-xl md:block lg:w-full [&:nth-child(n+4)]:hidden md:[&:nth-child(n+4)]:block">
      <header class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl px-14 py-10 lg:aspect-[1.8] xl:aspect-[2.3] 2xl:aspect-[2.35]">
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
  const getRelativeTime = (timeStr: string) => {
    const timeParts = timeStr.split(" at ");
    const datePart = timeParts[0];
    const timePart = timeParts[1];

    const [month, day, year] = datePart.split("/");
    const [time, meridiem] = timePart.split(" ");
    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);
    if (meridiem === "PM" && hour !== 12) {
      hour += 12;
    } else if (meridiem === "AM" && hour === 12) {
      hour = 0;
    }

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      hour,
      parseInt(minutes),
    );
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      hour12: true,
      timeZone: "UTC",
    };

    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div class="flex h-full max-h-[26em] flex-col overflow-hidden rounded-2xl border border-gray-300 bg-gradient-to-br from-white/80 to-gray-100/50 p-4 shadow-sm transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/70 hover:shadow-md md:block">
      <article
        id={"#" + props.title}
        class="flex flex-1 flex-col overflow-hidden rounded-2xl md:block"
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

          <div class="absolute bottom-2 left-2 rounded-lg bg-white bg-opacity-80 px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm backdrop-blur-sm">
            <div class="group relative">
              <Link
                href={`/places/${props.placeID}`}
                class="flex items-center gap-2 text-sm text-gray-700 transition-colors duration-300 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transition-colors duration-300 group-hover:stroke-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{props.placeName}</span>
              </Link>
            </div>
          </div>
          <div class="absolute bottom-2 right-2">
            <StatusBadge status={props.status || ""} />
          </div>
        </header>
        <div class="flex flex-1 flex-col justify-between">
          <Link
            href={props.link}
            class="transition-all duration-300  hover:opacity-90 active:scale-[1.01]"
          >
            <div class="flex flex-row gap-3 px-3 pt-4">
              <h1 class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{props.attendees + (props.host ? 0 : 1)}</span>
              </h1>
              <h1 class="flex items-center gap-2 text-sm font-medium text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{getRelativeTime(props.time)}</span>
              </h1>
            </div>
            <h1 class="px-3 py-2 text-lg font-semibold tracking-tight text-gray-900">
              {props.title}
            </h1>
            <p class="line-clamp-3 px-3 text-sm leading-relaxed text-gray-600">
              {props.description}
            </p>
          </Link>
        </div>
      </article>
      <div class="absolute bottom-1 mt-auto pt-2"></div>
    </div>
  );
});
