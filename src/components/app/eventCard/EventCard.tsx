import { component$ } from "@builder.io/qwik";
import { Tag } from "./Tag";
import { AttendeeList } from "./AttendeeList";

export type EventCardProps = {
  title: string;
  description: string;
  time: string;
  tags: string[];
  attendees: number;
  link: string;
};
const imgs = ["hello", "stuff", "world"];
export const EventCard = component$((props: EventCardProps) => {
  return (
    <article class="flex  w-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] lg:w-full">
      <header class="relative flex aspect-[2.85] w-full flex-col items-center justify-center overflow-hidden rounded-xl px-14 py-10">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f0587d3f7ff9e636884c0c2be54daa3f001d89360b3a629cd9b9bf25b05857c?placeholderIfAbsent=true&apiKey=17e6b1f5aff14ccdbcafd5a66c4951ca"
          class="size-full absolute inset-0 object-cover"
          alt=""
          width={500}
          height={500}
        />
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c9d86d9147e5822062e107d2ac807972850acb658678ae4643774a3402b4e153?placeholderIfAbsent=true&apiKey=17e6b1f5aff14ccdbcafd5a66c4951ca"
          class="aspect-square w-5 object-contain"
          alt="Event icon"
          width={500}
          height={500}
        />
      </header>
      <div class="mt-2.5 flex w-full flex-col font-medium text-neutral-400">
        <h2 class="text-sm text-gray-950">{props.title}</h2>
        <p class="mt-1.5 text-xs leading-none">{props.description}</p>
        <time class="mt-1.5 text-ellipsis text-xs uppercase leading-none tracking-wide">
          {props.time}
        </time>
      </div>
      <div class="mt-2.5 flex w-full items-start gap-2.5 text-center text-xs font-medium leading-none text-gray-600">
        {props.tags &&
          props.tags.map((tag, index) => <Tag key={index} text={tag} />)}
      </div>
      <div class="flex flex-row">
        <AttendeeList
          link={props.link}
          attendees={props.attendees}
          images={imgs}
        />
      </div>
    </article>
  );
});
