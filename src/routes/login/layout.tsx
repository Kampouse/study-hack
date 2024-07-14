import type { RequestHandler } from "@builder.io/qwik-city";
import { component$, Slot } from "@builder.io/qwik";
import { tursoClient } from "~/utils/turso";
import { useAuthSession } from "../plugin@auth";
type Session = {
  name: String;
  user: { email: string; name: string; image: string };
};

export const onRequest: RequestHandler = async (event) => {
  const session: Session | null = event.sharedMap.get("session");

  if (session) {
    const Client = tursoClient(event);
    const result = await Client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [session.user.email],
    });
    if (result.rows.length == 0) {
      const result = await Client.execute({
        sql: "INSERT INTO Users (email, name, username, ImageURL, IsAdmin) VALUES (?, ?, ?, ?, ?)",
        args: [
          session.user.email,
          session.user.name,
          session.user.name,
          session.user.image,
          0,
        ],
      });
      console.log("result->", result);
    }
  }

  // throw event.redirect(302, `/`,);
};

export default component$(() => {
  const session = useAuthSession();
  console.log("session->", session.value.user);
  return (
    <div class="">
      <Slot />
    </div>
  );
});
