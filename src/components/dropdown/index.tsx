import { component$ } from "@builder.io/qwik";
import { Link, Form } from "@builder.io/qwik-city";
import { useAuthSignout } from "~/routes/plugin@auth";
import { Dropdown } from "@qwik-ui/headless";
import { useAuthSession } from "~/routes/plugin@auth";
export default component$(() => {
  type Session = ReturnType<typeof useAuthSession>;
  const session = useAuthSession() as Session;
  const signout = useAuthSignout();
  const img = session.value?.user?.image || "https://s6.imgcdn.dev/LyfCg.jpg";
  const actions = [
    { label: "Profile", disabled: false, path: "/profile" },
    { label: "Setting", disabled: false, path: "/setting" },
    { label: "home page", disabled: false, path: "/" },
  ];

  return (
    <Dropdown.Root class="p-8">
      <Dropdown.Trigger class="">
        <img class="rounded-full" width={50} height={50} src={img} />
      </Dropdown.Trigger>
      <Dropdown.Popover class=" w-32 rounded-b-md p-1 shadow-sm">
        <Dropdown.Arrow class="" />
        <Dropdown.Content class="">
          <Dropdown.Group class="">
            {actions.map((action) => (
              <Dropdown.Item
                class="rounded-md hover:bg-gray-100"
                key={action.label}
                disabled={action.disabled}
              >
                <Link
                  class="flex w-full cursor-pointer  p-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  href={action.path}
                >
                  {action.label}
                </Link>
              </Dropdown.Item>
            ))}
            <Dropdown.Item class="rounded-md hover:bg-gray-100">
              <Form action={signout}>
                <input
                  class=""
                  type="hidden"
                  name="redirectTo"
                  value="/signedout"
                />
                <button class=" flex w-full cursor-pointer  p-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  Sign Out
                </button>
              </Form>
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
});
