import { component$, type QRL } from "@builder.io/qwik";

interface ItemProps {
  name: string;
  about: string;
  interests: string[];
  onEdit$: QRL<() => void>;
}

export default component$<ItemProps>(({ name, about, interests, onEdit$ }) => {
  return (
    <div class="flex flex-col gap-10 md:flex-row md:items-center md:gap-20">
      <img
        src="https://s6.imgcdn.dev/LyfCg.jpg"
        width={200}
        height={200}
        style="width: 200px; height: 200px;"
      />
      <div class="flex flex-col justify-center gap-4">
        <h1 class="text-5xl">{name}</h1>
        <div>
          <p>{about}</p>
        </div>
        <div class="grid grid-cols-2 items-start gap-2 md:flex md:justify-between">
          {interests.map((item, index) => {
            return (
              <div key={index} class="rounded-lg w-fit p-2 text-black bg-gray-300 cursor-pointer hover:bg-[#90EE90]">
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <div class="order-first self-start md:order-last">
        <button
          onClick$={onEdit$}
          class="self-start rounded-full p-3 text-sm text-black bg-white shadow-[0_8px_15px_rgba(0,0,0,0.1)] transition-all hover:text-white hover:bg-[#90EE90]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-line">
            <path d="M12 20h9"/>
            <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
            <path d="m15 5 3 3"/></svg>
        </button>
      </div>
    </div>
  );
});