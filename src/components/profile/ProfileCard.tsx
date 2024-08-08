import { Modal } from "@qwik-ui/headless";
import { component$, type Signal } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";

type CardProps = {
  data: { name: string; about: string; interests: string[] };
  active: Signal<boolean>;
  onEdit: () => void;
};

export default component$<CardProps>(({ data }) => {
  const session = useAuthSession();
  const image = session.value?.user?.image;
  return (
    <div class="flex flex-col gap-5 md:flex-row md:items-center md:gap-5 ">
      <div class="flex flex-row">
        <Modal.Trigger>
          <img
            src={image || "https://via.placeholder.com/200"}
            class="shadow-[0_8px_15px_rgba(0,0,0,0.1) rounded-full"
            width={200}
            height={200}
          />
        </Modal.Trigger>

        <Modal.Trigger
          class="
              self-end rounded-full bg-white p-3 text-sm text-black shadow-[0_8px_15px_rgba(0,0,0,0.1)] transition-all hover:bg-[#90EE90] hover:text-white
              "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-pencil-line"
          >
            <path d="M12 20h9" />
            <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
            <path d="m15 5 3 3" />
          </svg>
        </Modal.Trigger>
      </div>

      <div class="flex flex-col justify-center gap-4">
        <h1 class="text-5xl">{data.name}</h1>
        <div>
          <p>{data.about}</p>
        </div>
        <div class="grid grid-cols-2 items-start gap-2 md:flex md:justify-between">
          {data.interests.map((item, index) => {
            return (
              <div
                key={index}
                class="w-fit cursor-pointer rounded-lg bg-gray-300 p-2 text-black hover:bg-[#bede91]"
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
      <div class="order-first self-start md:order-last"></div>
    </div>
  );
});
