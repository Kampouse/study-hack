import { component$, type QRL } from "@builder.io/qwik";

interface ItemProps {
  name: string;
  about: string;
  onEdit$: QRL<() => void>;
}

export default component$<ItemProps>(({ name, about, onEdit$ }) => {
  const interests: string[] = ["HTML", "CSS", "JavaScript", "Sunlight"];
  return (
    <div class="flex flex-col gap-10 p-16 md:flex-row md:items-center md:gap-20">
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
        <div class="flex flex-col items-start gap-2 md:flex-row md:justify-between">
          {interests.map((item, index) => {
            return (
              <div key={index} class="rounded-lg bg-gray-300 p-2 text-black">
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <div class="order-first self-start md:order-last">
        <button
          onClick$={onEdit$}
          class="self-start rounded-lg bg-green-500 p-3 text-sm text-black hover:bg-green-600"
        >
          Edit
        </button>
      </div>
    </div>
  );
});
