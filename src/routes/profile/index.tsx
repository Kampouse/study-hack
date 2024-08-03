import { component$, $, useStore } from "@builder.io/qwik";
import { MapWrapper as Leaflet } from "~/components/leaflet-map";

interface FormProps {
  data: { name: string, about: string, interests: string[] };
  onSave: (e:Event) => void;
  onChange: (e: Event) => void;
}

interface CardProps {
  data: { name: string, about: string, interests: string[] };
  onEdit: () => void;
}

interface LocationFormProps {
  data: { when: string, what: string, where: string };
}

const ProfileForm = component$<FormProps>(({ data, onSave, onChange }) => {
  return (
    <form onSubmit$={onSave} class="flex flex-col gap-4 max-w-xl">
      <div class="jus flex flex-col gap-2">
        <label for="name" class="text-lg">
          Display name
        </label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="name"
          name="name"
          value={data.name}
          onInput$={onChange}
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
          value={data.about}
          onInput$={onChange}
        />
      </div>
      <fieldset class="flex flex-col gap-2">
        <div><legend class="text-lg">Interests</legend></div>
        <ul class="flex flex-col gap-2 rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500">
          {data.interests.map((item, index) => {
            return (
              <li key={index} class="grid grid-cols-2">
                <label for={item} class="span-1">{item}</label>
                <input type="checkbox"
                  id={item} name="interests"
                  checked={data.interests.includes(item)}
                  onChange$={onChange}
                  class="span-1" />
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
    </form>
  );
});

const ProfileCard = component$<CardProps>(({ data, onEdit }) => {
  return (
    <div class="flex flex-col gap-10 md:flex-row md:items-center md:gap-20">
      <img
        src="https://s6.imgcdn.dev/LyfCg.jpg"
        width={200}
        height={200}
        style="width: 200px; height: 200px;"
      />
      <div class="flex flex-col justify-center gap-4">
        <h1 class="text-5xl">{data.name}</h1>
        <div>
          <p>{data.about}</p>
        </div>
        <div class="grid grid-cols-2 items-start gap-2 md:flex md:justify-between">
          {data.interests.map((item, index) => {
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
          onClick$={onEdit}
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

const LocationForm = component$<LocationFormProps>(({ data }) => {
  return (
    <form class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label>When are you going?</label>
        <select class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500">
          <option>12h</option>
          <option>13h</option>
        </select>
      </div>
      <div class="flex flex-col gap-2">
        <label for="what">What are you working on?</label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="what"
          name="what"
          value={data.what}
        />
      </div>
      <div class="flex flex-col gap-2">
        <label>Where will you be?</label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="where"
          name="where"
          value={data.where}
        />
      </div>
    </form>
  );
});

export default component$(() => {
  const mapStatus = useStore({
    active: false,
    when: "",
    what: "",
    where: "",
  });

  const store = useStore({
    name: "Sunflower",
    about: "Just a plant... photosynthesizing",
    interests: ["HTML", "CSS", "JavaScript", "Sunlight"],
    editMode: false,
  });

  const handleSaveClick = $((e: Event) => {
    e.preventDefault();
    store.editMode = false;
  });

  const handleEditClick = $(() => {
    store.editMode = true;
  });

  const handleChange = $((e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "name") {
      store.name = target.value;
    } else if (target.name === "about") {
      store.about = target.value;
    } else if (target.name === "interests") {
      if (target.checked) {
        store.interests.push(target.value);
      } else {
        store.interests = store.interests.filter(item => item !== target.value);
      }
    }
  });

  const handleMapSelect = $(() => {
    mapStatus.active = true;
  });

  return (
    <main class="flex flex-col gap-10 p-16">
      <div>
        {store.editMode ? (
          <ProfileForm
            data={{ name: store.name, about: store.about, interests: store.interests }}
            onSave={handleSaveClick}
            onChange={handleChange}
          />
        ) : (
          <ProfileCard
            data={{ name: store.name, about: store.about, interests: store.interests }}
            onEdit={handleEditClick}
          />
        )}
      </div>
      <div class={`flex flex-col gap-4 ${store.editMode ? "hidden" : "block"}`}>
        <div class={`flex flex-col gap-2 ${!mapStatus.active ? "block" : "hidden"}`}>
          <h2 class="w-fit text-3xl">Where will you be?</h2>
          <button class="w-fit text-xl underline italic" onClick$={handleMapSelect}>
            Press to select
          </button>
        </div>
        <div class={`${!mapStatus.active ? "" : "flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-10"}`}>
          <div class={`h-fit md:col-span-1 ${!mapStatus.active ? "opacity-40" : "opacity-100"}`}>
            <Leaflet />
          </div>
          <div class={`md:col-span-1 ${!mapStatus.active ? "hidden" : "block"}`}>
            <LocationForm 
              data={{ when: mapStatus.when, what: mapStatus.what, where: mapStatus.where }}
            />
          </div>
        </div>
      </div>
    </main>
  );
});