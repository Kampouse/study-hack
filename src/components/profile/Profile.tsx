import { useStore, component$, type QRL, $ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";

interface FormProps {
  name: string;
  about: string;
  interests: string[];
  onSave$: QRL<() => void>;
  onChange$: QRL<(e: Event) => void>;
}

interface CardProps {
  name: string;
  about: string;
  interests: string[];
  onEdit$: QRL<() => void>;
}

const ProfileForm = component$<FormProps>(({ name, about, interests, onChange$ }) => {
  return (
    <Form class="flex flex-col gap-4 max-w-xl">
      <div class="jus flex flex-col gap-2">
        <label for="name" class="text-lg">
          Display something
        </label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="name"
          name="name"
          value={name}
          onInput$={onChange$}
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="about" class="text-lg">
          About you
        </label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="about"
          name="about"
          value={about}
          onInput$={onChange$}
        />
      </div>
      <fieldset class="flex flex-col gap-2">
        <div><legend class="text-lg">Interests</legend></div>
        <ul class="flex flex-col gap-2 rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500">
          {interests.map((item, index) => {
            return (
              <li key={index} class="grid grid-cols-2">
                <label for={item} class="span-1">{item}</label>
                <input type="checkbox" id={item} name="interests" class="span-1" />
              </li>
            )
          })}
        </ul>
      </fieldset>
      <button
        type="submit"
        class="self-start rounded-lg bg-green-500 p-3 text-sm text-black hover:bg-[#90EE90]"
      >
        Save
      </button>
    </Form>
  )
});

const ProfileCard = component$<CardProps>(({ name, about, interests, onEdit$ }) => {
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
            <path d="M12 20h9" />
            <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
            <path d="m15 5 3 3" /></svg>
        </button>
      </div>
    </div>
  );
});

export default component$(() => {
  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    interests: ["HTML", "CSS", "JavaScript", "Sunlight"],
    editMode: false,
  });

  const handleSaveClick = $(() => {
    store.editMode = false;
  });

  const handleEditClick = $(() => {
    store.editMode = true;
  });

  const handleChange = $((e: Event) => {
    console.log((e.target as HTMLInputElement).value);
  })

  return (
    <div>
      {store.editMode ? (
        <ProfileForm
          name={store.name}
          about={store.about}
          interests={store.interests}
          onSave$={handleSaveClick}
          onChange$={handleChange}
        />
      ) : (
        <ProfileCard
          name={store.name}
          about={store.about}
          interests={store.interests}
          onEdit$={handleEditClick}
        />
      )}
    </div>
  );
});
