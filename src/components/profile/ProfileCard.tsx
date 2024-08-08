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
    <div class="flex flex-col items-center   gap-5 md:flex-row md:gap-5 lg:items-start ">

      <div class="flex flex-col justify-center ">
        <div
          class=" flex flex-col md:flex-row  px-2 md:items-start
        lg:items-start"
        >
          <div class="flex   flex-row">
            <Modal.Trigger>
              <img
                src={image || "https://via.placeholder.com/200"}
                class="shadow-[0_8px_15px_rgba(0,0,0,0.1) rounded-full py-1"
                width={175}
                height={175}
              />
            </Modal.Trigger>

            <Modal.Trigger
              class="
                  self-end rounded-full bg-white pl-4 p-3 text-sm text-black shadow-[0_8px_15px_rgba(0,0,0,0.1)] transition-all hover:bg-[#90EE90] hover:text-white
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
          <div class=" self-center">
            <h1 class=" pl-2 py-0 text-3xl text-zinc-900">{data.name}</h1>
            <p class="py-1 pl-2 text-[#939393]">{data.about}</p>

            <div class="flex flex-wrap items-start gap-2 px-2 ">
              {data.interests.map((item, index) => {
                return (
                  <div
                    key={index}
                    class="w-fit cursor-pointer rounded-lg bg-gray-300 p-2 text-black hover:bg-[#90EE90]"
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
});
