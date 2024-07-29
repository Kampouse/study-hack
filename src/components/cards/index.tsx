import { component$ } from "@builder.io/qwik";
type UserCard = {
  name: string;
  description: string;
  time: string;
  tags: string[];
};
type UserCardProps = {
  user?: UserCard;
};

export const UserCards = component$<UserCardProps>((props) => {
  const defaultUserCard: UserCard = {
    name: "Kampouse",
    description: "studying for cs-231",
    time: "1pm - 4pm",
    tags: ["python", "javascript", "study"],
  };
  const user = props.user || defaultUserCard;
  return (
    <div class="px flex w-full content-center rounded-xl border  px-4  py-2 shadow-md md:p-8 md:pb-0 ">
      <div class="">
        <div class=" flex w-full flex-col">
          <div class="flex h-20 flex-row gap-4">
            <img
              height={75}
              width={75}
              class=" self-start"
              src="https://s6.imgcdn.dev/LyfCg.jpg"
            />
            <div class="flex flex-col gap-1 self-center  ">
              <h1 class="self-start font-bold">{user.name}</h1>
              <h1 class="font-semibol  self-start">{user.description}</h1>
              <h1 class="self-start  font-light">{user.time}</h1>
            </div>
          </div>

          <div class="flex flex-row justify-start  gap-2   pt-4 ">
            <button class="max-w-lg self-end rounded-md bg-green-400  p-2 text-black  ">
              Join me
            </button>

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