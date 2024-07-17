import { component$, $, useStore } from "@builder.io/qwik";
import ProfileForm from "~/components/profile/ProfileForm";
import ProfileCard from "~/components/profile/ProfileCard";
export default component$(() => {
  const store = useStore({ name: "Sunflower", about: "Just a plant... photosynthesizing", editMode: false });

  const handleSaveClick = $(() => {
    store.editMode = false;
  });

  const handleEditClick = $(() => {
    store.editMode = true;
  });

  return (
    <div>
      {store.editMode ? (
        <ProfileForm
          name={store.name}
          about={store.about}
          onSave$={handleSaveClick}
        />
      ) : (
        <ProfileCard
          name={store.name}
          about={store.about}
          onEdit$={handleEditClick}
        />
      )}
    </div>
  );
});
