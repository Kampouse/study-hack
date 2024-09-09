import { Users, Events, Requests } from "../../drizzle/schema";
import type { Session } from "./drizzled";
import { eq } from "drizzle-orm";
import type { Requested } from "./drizzled";
import { drizzler } from "./drizzled";
import type { UpdateUserForm, CreateEventForm } from "~/api/Forms";

export type User = {
  Name: string;
  Email: string;
  Description: string;
  Username: string;
  ImageURL: string;
  IsAdmin: boolean;
  Intrests: Array<string>;
};


export type ClientType = Awaited<ReturnType<typeof drizzler>>;
export const CreateUser = async (event: Requested | undefined, session: Session, client: ClientType | null = null) => {
  const Client = client ?? await drizzler(event as Requested);
  if (Client === null) {
    console.log("Client not initialized");

    return;
  }

  console.log("Client initialized");
  try {
    const data = await Client.select()

      .from(Users)
      .where(eq(Users.Email, session.user.email))
      .execute();
    if (data.length == 0) {
      return await Client.insert(Users)
        .values({
          Email: session.user.email,
          Name: session.user.name,
          Description: "i am new here",
          Username: session.user.name,
          ImageURL: session.user.image,
          IsAdmin: 0,
        }).returning()
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
    await Client.update(Users)
      .set({
        Name: session.Name,
        Description: session.Description,
      })
      .where(eq(Users.Email, data.user.email))
      .execute();
    return session;
  }
};
export const GetUser = async (event: Requested) => {
  const Client = await drizzler(event);
  const data = serverSession(event);
  if (data !== null && Client !== null) {
    const userData = await Client.select({
      ID: Users.UserID,
      Name: Users.Name,
      Description: Users.Description,
      Image: Users.ImageURL,
      Intrests: Users.Intrestets,
    })
      .from(Users)
      .where(eq(Users.Email, data.user.email))
      .execute()
      .catch((e) => {
        console.log(e);
        return [];
      });
    if (userData.length > 0) {
      return userData[0];
    } else {
      return null;
    }
  }
};

export const CreateEvent = async (
  event: Requested,
  session: CreateEventForm,
) => {
  const userData = await GetUser(event);
  const Client = await drizzler(event);
  if (userData === undefined || Client === null || userData === null) return;
  return await Client.insert(Events)

    .values({
      Name: session.Name,
      Description: session.Description,
      Location: session.Location,
      Coordinates: session.Coordinates,
      Date: session.Date,
      CreatedAt: new Date().toISOString(),
      StartTime: session.StartTime,
      EndTime: session.EndTime,
      Tags: [],
      ImageURL: session.ImageURL ?? "",
      UserID: userData.ID,
    })
    .returning({
      Name: Events.Name,
      Description: Events.Description,
      Location: Events.Location,
      Coordinates: Events.Coordinates,
      Date: Events.Date,
      StartTime: Events.StartTime,
      EndTime: Events.EndTime,
      Tags: Events.Tags,
      UserID: Events.UserID,
    })

    .execute()
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export type QueryEventOptions = {
  limit?: number;
  offset?: number;
  tags?: string[];
  location?: string;
  date?: Date | null;
  orderBy?: "Date" | "Name";
  client?: ClientType | null;
};
export const QueryEvent = async (
  event: Requested,
  id: number,
  options: QueryEventOptions | undefined,
) => {
  const Client = options?.client || (await drizzler(event));

  if (Client === null) return;
  return await Client.select({
    name: Events.Name,
    description: Events.Description,
    location: Events.Location,
    coordinates: Events.Coordinates,
    date: Events.Date,
    starttime: Events.StartTime,
    endtime: Events.EndTime,
    tags: Events.Tags,
    eventID: Events.EventID,
    image: Events.ImageURL,
  })

    .from(Events)
    .where(eq(Events.EventID, id))
    .execute()
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export const QueryEvents = async (
  event: Requested | undefined,
  options: QueryEventOptions = {
    limit: 3,
    offset: 0,
    tags: [],
    location: "",
    date: null,
    orderBy: "Date",
    client: null,
  },
) => {
  const Client = options.client || (await drizzler(event as Requested));

  if (Client == null) return null;
  const builder = options.orderBy === "Date" ? Events.Date : Events.Name;
  return await Client.select({
    name: Events.Name,
    description: Events.Description,
    location: Events.Location,
    coordinates: Events.Coordinates,
    date: Events.Date,
    starttime: Events.StartTime,
    endtime: Events.EndTime,
    tags: Events.Tags,
    eventID: Events.EventID,
    image: Events.ImageURL,
  })
    .from(Events)
    .limit(options.limit ?? 3)
    .orderBy(builder)
    .execute()
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export const createRequest = async (
  event: Requested,
  requestData: {
    eventId: number;
    userId: number;
    background: string;
    experience: string;
    why: string;

  }, client: ClientType | null = null
) => {
  const Client = client ?? await drizzler(event);
  if (Client === null) return null;

  try {
    const result = await Client.insert(Requests)
      .values({
        EventID: requestData.eventId,
        UserID: requestData.userId,
        Experience: requestData.experience,
        Background: requestData.background,
        WhyJoin: requestData.why,
        CreatedAt: new Date().toISOString(),
      })
      .returning({
        RequestID: Requests.RequestID,
        EventID: Requests.EventID,
        UserID: Requests.UserID,
        Status: Requests.Status,
        CreatedAt: Requests.CreatedAt,
      })
      .execute();

    return result[0];
  } catch (error) {
    console.error("Error creating request:", error);
    return null;
  }
};
