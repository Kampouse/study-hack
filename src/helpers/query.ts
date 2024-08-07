import { users } from "../../drizzle/schema";
import type { Session } from "./drizzled";
import { eq } from "drizzle-orm";
import type { Requested } from "./drizzled";
import { drizzler } from "./drizzled";
import type { UpdateUserForm } from "~/api/Forms";
export type User = {
  Name: string;
  Email: string;
  Description: string;
  Username: string;
  ImageURL: string;
  IsAdmin: boolean;
  Intrests: Array<string>;
};

export const CreateUser = async (event: Requested, session: Session) => {
  console.log(session);

  const Client = await drizzler(event);
  if (Client === null) {
    console.log("Client not initialized");

    return;
  }

  console.log("Client initialized");
  try {
    const data = await Client.select()

      .from(users)
      .where(eq(users.Email, session.user.email))
      .execute();
    console.log("any data", data);
    if (data.length == 0) {
      console.log("Writing to database");
      await Client.insert(users)
        .values({
          Email: session.user.email,
          Name: session.user.name,
          Description: "i am new here",
          Username: session.user.name,
          ImageURL: session.user.image,
          IsAdmin: false,
        })
        .execute()
        .catch((e) => {
          console.log("issue", e);
        });
    } else {
      console.log("User already exists", data[0]);

      return;
    }
  } catch (e) {
    console.log(e);
  }
  console.log("no data found ??");
};

export const serverSession = (event: Requested) => {
  type Session = {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
  } | null;
  return event.sharedMap.get("session") as Session;
};

export const UpdateUser = async (event: Requested, session: UpdateUserForm) => {
  const Client = await drizzler(event);
  if (Client === null) return;
  console.log(session.Name, session.Description);
  const data = serverSession(event);
  if (data !== null) {
    await Client.update(users)
      .set({
        Name: session.Name,
        Description: session.Description,
      })
      .where(eq(users.Email, data.user.email))
      .execute();
    return session;
  }
};
export const GetUser = async (event: Requested) => {
  const Client = await drizzler(event);
  const data = serverSession(event);
  if (data !== null && Client !== null) {
    const userData = await Client.select({
      Name: users.Name,
      Description: users.Description,
      Image: users.ImageURL,
      Intrests: users.Intrests,
    })
      .from(users)
      .where(eq(users.Email, data.user.email))
      .execute();
    if (userData[0]) {
      return userData[0];
    }
  }
};
