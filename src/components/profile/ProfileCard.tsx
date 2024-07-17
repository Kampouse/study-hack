import { component$, type QRL } from "@builder.io/qwik";
import Sunflower from "../../media/sunflower.jpg";

interface ItemProps {
  name: string;
  about: string;
  onEdit$: QRL<() => void>;
}

export default component$<ItemProps>(({ name, about, onEdit$ }) => {
  const interests: string[] = ["HTML", "CSS", "JavaScript", "Sunlight"];
  return (
    <div class="flex flex-col gap-10 p-16 md:flex-row md:items-center md:gap-20">
      <img src={Sunflower} width={200} height={200} style="width: 200px; height: 200px;" />
      <div class="flex flex-col justify-center gap-4">
        <h1 class="text-5xl">{name}</h1>
        <div>
          <p>{about}</p>
        </div>
        <div class="flex flex-col items-start gap-2 md:flex-row md:justify-between">
          {interests.map((item, index) => {
            return (
              <div key={index} class="bg-gray-300 text-black p-2 rounded-lg">{item}</div>
            )
          })}
        </div>
      </div>
      <div class="self-start order-first md:order-last">
        <button onClick$={onEdit$} class="self-start p-3 text-sm text-black rounded-lg bg-green-500 hover:bg-green-600">Edit</button>
      </div>
    </div>
  );
});
