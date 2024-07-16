import type { RequestHandler } from "@builder.io/qwik-city";
import { component$, Slot } from "@builder.io/qwik";
import { tursoClient as drizzle } from "~/utils/turso";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
type Session = {
  name: String;
  user: { email: string; name: string; image: string };
};

export const onRequest: RequestHandler = async (event) => {

  const session: Session | null = event.sharedMap.get("session");
  //get env vairables
  const url = event.env.get("PRIVATE_TURSO_DATABASE_URL")
  const token = event.env.get("PRIVATE_TURSO_AUTH_TOKEN")
  console.log("session->", session);
  if (session) {
    const Client = drizzle({
      url: url,
      authToken: token,
    });
    const data = await Client.select().from(users).where(eq(users.Email, session.user.email));
    if (data.length == 0) {





      //console.log("result->", result);
    }
    if (data.length == 0) {
      await Client.insert(users).values({
        Email: session.user.email,
        Name: session.user.name,
        Username: session.user.name,
        ImageURL: session.user.image,
        IsAdmin: false,
      });
    }
    if (data.length > 0) {
      console.log("data->", data);

    }



    /*

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
       */
    //console.log("result->", result);
  }


  // throw event.redirect(302, `/`,);
};

export default component$(() => {
  return (
    <div class="">
      <Slot />
    </div>
  );
});
