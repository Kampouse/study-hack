import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { tursoClient } from "~/utils/turso";
import { users } from "../../../drizzle/schema";
export const useGetUsers = routeLoader$(async () => {
  const data = tursoClient().select().from(users).limit(1);
  return data;
});

export default component$(() => {
  const users = useGetUsers();
  console.log(users);
  return (
    <section>
      <h1>User's directory</h1>
      <ul>
        {users.value.map((user) => (
          <li key={user.Name}>
            <a href={`/users/${user.Name}`}>
              {user.Name} ({user.Email})
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
});
