import { component$ } from "@builder.io/qwik";

import { Dropdown } from "@qwik-ui/headless";
import { useAuthSession } from "~/routes/plugin@auth";
export default component$(() => {
  type Session = ReturnType<typeof useAuthSession>;
  const session = useAuthSession() as Session;
  const img = session.value?.user?.image || "https://s6.imgcdn.dev/LyfCg.jpg";
  const actions = [
    { label: "whatup", disabled: false },
    { label: "what up", disabled: false },
    { label: "what up", disabled: false },
  ];

  return (
    <Dropdown.Root class="">
      <Dropdown.Trigger class="">
        <img class="rounded-full" width={50} height={50} src={img} />
      </Dropdown.Trigger>
      <Dropdown.Popover class="p-2 shadow-sm">
        <Dropdown.Arrow class="" />
        <Dropdown.Content class="">
          <Dropdown.Group class="">
            {actions.map((action) => (
              <Dropdown.Item
                key={action.label}
                class=""
                disabled={action.disabled}
              >
                {action.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
});
