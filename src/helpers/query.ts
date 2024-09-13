import { Users, Events, Requests } from "../../drizzle/schema";
import type { Session } from "./drizzled";
import { eq } from "drizzle-orm";
import type { Requested } from "./drizzled";
import { drizzler } from "./drizzled";
import { sql } from "drizzle-orm";
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
export const CreateUser = async (params: {
  event: Requested | undefined;
  session: Session;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    console.log("Client not initialized");
    return;
  }

  console.log("Client initialized");
  try {
    const data = await Client.select()
      .from(Users)
      .where(eq(Users.Email, params.session.user.email))
      .execute();
    if (data.length == 0) {
      return await Client.insert(Users)
        .values({
          Email: params.session.user.email,
          Name: params.session.user.name,
          Description: "i am new here",
          Username: params.session.user.name,
          ImageURL: params.session.user.image,
          IsAdmin: 0,
        })
        .returning()
        .execute()
        .catch((e) => {
          console.log("issue", e);
        });
    } else {
      console.log("User already exists", data[0]);
      return data[0];
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

export const UpdateUser = async (params: {
  event: Requested;
  session: UpdateUserForm;
}) => {
  const Client = await drizzler(params.event);
  if (Client === null) return;
  console.log(params.session.Name, params.session.Description);
  const data = serverSession(params.event);
  if (data !== null) {
    await Client.update(Users)
      .set({
        Name: params.session.Name,
        Description: params.session.Description,
      })
      .where(eq(Users.Email, data.user.email))
      .execute();
    return params.session;
  }
};

export const GetUser = async (params: { event: Requested }) => {
  const Client = await drizzler(params.event);
  const data = serverSession(params.event);
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

export type GetUserReturnType = Awaited<ReturnType<typeof GetUser>>;
export const CreateEvent = async (params: {
  event: Requested | undefined;
  session: CreateEventForm;
  Client: ClientType | null;
  userData?: GetUserReturnType | null;
}) => {
  const userData =
    params.userData ?? (await GetUser({ event: params.event as Requested }));
  const Client = params.Client ?? (await drizzler(params.event as Requested));
  if (userData === undefined || Client === null || userData === null) return;

  console.log(params);

  return await Client.insert(Events)
    .values({
      Name: params.session.Name,
      Description: params.session.Description,
      Location: params.session.Location,
      Coordinates: params.session.Coordinates,
      Date: params.session.Date,
      CreatedAt: new Date().toISOString(),
      StartTime: params.session.StartTime,
      EndTime: params.session.EndTime,
      Tags: [],
      ImageURL: params.session.ImageURL ?? "",
      UserID: params.userData?.ID ?? userData.ID,
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
      EventID: Events.EventID,
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
  from?: Date;
  to?: Date;
  byUser?: number;
  active?: boolean;
};

export const QueryEvent = async (params: {
  event: Requested;
  id: number;
  options: QueryEventOptions | undefined;
}) => {
  const Client = params.options?.client || (await drizzler(params.event));

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
    .where(eq(Events.EventID, params.id))
    .execute()
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export const QueryEvents = async (params: {
  event: Requested | undefined;
  options?: QueryEventOptions;
}) => {
  params.options = params.options ?? {};

  const Client =
    params.options.client || (await drizzler(params.event as Requested));

  if (Client == null) return null;
  //const builder = params.options.orderBy === "Date" ? Events.Date : Events.Name;
  const output = await Client.select({
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

    .where(
      params.options.byUser
        ? eq(Events.UserID, params.options.byUser)
        : undefined,
    )
    .orderBy(sql`RANDOM()`)
    .limit(params.options.limit ?? 3)
    .offset(params.options.offset ?? 0)
    .execute()

    .catch((e) => {
      console.log(e);
      return null;
    });

  return output;
};

export const QueryActiveEvent = async (params: {
  event: Requested | undefined;
  options?: QueryEventOptions;
  user: GetUserReturnType;
}) => {
  params.options = params.options ?? {};

  const Client =
    params.options.client || (await drizzler(params.event as Requested));

  if (Client == null || params.user == null) return null;
  //const builder = params.options.orderBy === "Date" ? Events.Date : Events.Name;

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
    requestStatus: Requests.Status,
  })
    .from(Events)
    .innerJoin(Requests, eq(Events.EventID, Requests.EventID))
    .where(eq(Requests.UserID, params.user.ID))
    .intersect(
      Client.select({
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
        requestStatus: Requests.Status,
      })
        .from(Events)
        .innerJoin(Requests, eq(Events.EventID, Requests.EventID))
        .where(eq(Requests.UserID, params.user.ID)),
    )
    .limit(params.options.limit ?? 3)
    .offset(params.options.offset ?? 0)
    .execute()
    .catch((e) => {
      console.log(e);
      return null;
    });
};

export const QueryActiveRequest = async (params: {
  event: Requested | undefined;
  options?: QueryEventOptions;
  user: GetUserReturnType;
}) => {
  params.options = params.options ?? {};

  const Client =
    params.options.client || (await drizzler(params.event as Requested));

  if (Client == null || params.user == null) return null;
  //const builder = params.options.orderBy === "Date" ? Events.Date : Events.Name;
  // to be changed
  try {
    return await Client.select({
      eventId: Events.EventID,
      eventName: Events.Name,
      requestId: Requests.RequestID,
      requestStatus: Requests.Status,
      why: Requests.WhyJoin,
      background: Requests.Background,
      username: Users.Username,
      image: Users.ImageURL,
      email: Users.Email,
    })
      .from(Events)
      .leftJoin(Requests, eq(Events.EventID, Requests.EventID))
      .leftJoin(Users, eq(Users.UserID, Requests.UserID))
      .where(
        sql`${Events.UserID} != ${Requests.UserID} AND ${Requests.Status} = 'pending'`,
      );
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const createJoinRequest = async (params: {
  event: Requested | undefined;
  requestData: {
    eventId: number;
    userId: number;
    background: string;
    experience: string;
    why: string;
  };
  client?: ClientType | null;
}) => {
  const Client = (await drizzler(params.event as Requested)) ?? params.client;
  if (Client === null || Client == undefined)
    return {
      data: null,
      success: false,
      message: "Client not found",
    };

  try {
    return {
      data: (
        await Client.insert(Requests)
          .values({
            EventID: params.requestData.eventId,
            UserID: params.requestData.userId,
            Experience: params.requestData.experience,
            Background: params.requestData.background,
            WhyJoin: params.requestData.why,
            CreatedAt: new Date().toISOString(),
          })
          .returning({
            RequestID: Requests.RequestID,
            EventID: Requests.EventID,
            UserID: Requests.UserID,
            Status: Requests.Status,
            CreatedAt: Requests.CreatedAt,
          })
          .execute()
      )[0],
      success: true,
      message: "Request created",
    };
  } catch (error) {
    console.error("Error creating request:", error);
    return {
      data: null,
      success: false,
      message: "Error creating request",
    };
  }
};
export const updateRequestStatus = async (params: {
  event: Requested | undefined;
  requestId: number;
  newStatus: "confirmed" | "denied";
  client?: ClientType | null;
}) => {
  const Client = (await drizzler(params.event as Requested)) ?? params.client;
  if (Client === null || Client == undefined)
    return {
      success: false,
      message: "Client not found",
    };

  try {
    const result = await Client.update(Requests)
      .set({
        Status: params.newStatus,
      })
      .where(eq(Requests.RequestID, params.requestId))
      .returning({
        RequestID: Requests.RequestID,
        EventID: Requests.EventID,
        UserID: Requests.UserID,
        Status: Requests.Status,
      })
      .execute();

    if (result.length === 0) {
      return {
        success: false,
        message: "Request not found",
      };
    }

    return {
      data: result[0],
      success: true,
      message: `Request status updated to ${params.newStatus}`,
    };
  } catch (error) {
    console.error("Error updating request status:", error);
    return {
      success: false,
      message: "Error updating request status",
    };
  }
};
