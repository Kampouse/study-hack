import { Users, Events, Requests } from "../../drizzle/schema";
import type { Session } from "./drizzled";
import { eq, and, ne, or } from "drizzle-orm";
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
export const CreateUser = async (params: {
  event: Requested | undefined;
  session: Session;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    console.log("Client not initialized");
    return null;
  }

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
          return null;
        });
    } else {
      console.log("User already exists", data[0]);
      return data[0];
    }
  } catch (e) {
    console.log(e);

    return null;
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

export const GetUserFromEmail = async (params: {
  event: Requested | undefined;
  email: string;
  client?: ClientType;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) return null;

  try {
    const userData = await Client.select({
      ID: Users.UserID,
      Name: Users.Name,
      Email: Users.Email,
      Description: Users.Description,
      Username: Users.Username,
      ImageURL: Users.ImageURL,
      IsAdmin: Users.IsAdmin,
      Intrests: Users.Intrestets,
    })
      .from(Users)
      .where(eq(Users.Email, params.email))
      .execute();

    if (userData.length > 0) {
      return userData[0];
    } else {
      return null;
    }
  } catch (e) {
    console.log("Error fetching user by ID:", e);
    return null;
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
        ? ne(Events.UserID, params.options.byUser)
        : undefined,
    )
    .limit(params.options.limit ?? 3)
    .offset(params.options.offset ?? 0)
    .execute()

    .catch((e) => {
      console.log(e);
      return null;
    });

  return output;
};

export const QueryAllReferenceEvents = async (params: {
  event: Requested;
  options?: QueryEventOptions;
  UserID: number;
}) => {
  params.options = params.options ?? {};
  const Client =
    params.options.client || (await drizzler(params.event as Requested));

  if (Client == null) return null;
  //const builder = params.options.orderBy === "Date" ? Events.Date : Events.Name;
  const hostedEvents = await Client.select({
    eventID: Events.EventID,
    name: Events.Name,
    description: Events.Description,
    location: Events.Location,
    coordinates: Events.Coordinates,
    date: Events.Date,
    starttime: Events.StartTime,
    endtime: Events.EndTime,
    tags: Events.Tags,
    image: Events.ImageURL,
    userID: Events.UserID,
  })
    .from(Events)
    .where(eq(Events.UserID, params.UserID))
    .execute();

  const attendingEvents = await Client.select({
    event: {
      image: Events.ImageURL,
      eventID: Events.EventID,
      name: Events.Name,
      description: Events.Description,
      location: Events.Location,
      date: Events.Date,
      startTime: Events.StartTime,
      endTime: Events.EndTime,
    },
    request: {
      status: Requests.Status,
      requestID: Requests.RequestID,
      userID: Requests.UserID,
      eventID: Requests.EventID,
      experience: Requests.Experience,
      background: Requests.Background,
      whyJoin: Requests.WhyJoin,
      createdAt: Requests.CreatedAt,
    },
  })
    .from(Requests)
    .innerJoin(Events, eq(Events.EventID, Requests.EventID))
    .where(eq(Requests.UserID, params.UserID))
    .execute();

  const mergedEvents = [
    ...hostedEvents.map((event) => ({ ...event, host: true })),
    ...attendingEvents.map(({ event, request }) => ({
      ...event,
      ...request,
      host: false,
    })),
  ];

  mergedEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return mergedEvents;
};

export const QueryMyCompletedRequests = async (params: {
  event: Requested | undefined;
  options?: QueryEventOptions;
  user: GetUserReturnType;
}) => {
  params.options = params.options ?? {};

  const Client =
    params.options.client || (await drizzler(params.event as Requested));

  if (Client == null || params.user == null) return null;

  try {
    return await Client.select({
      eventId: Events.EventID,
      eventName: Events.Name,
      eventImg: Events.ImageURL,
      requestId: Requests.RequestID,
      requestStatus: Requests.Status,
      why: Requests.WhyJoin,
      background: Requests.Background,
      createdAt: Requests.CreatedAt,
    })
      .from(Requests)
      .innerJoin(Events, eq(Events.EventID, Requests.EventID))
      .where(
        and(
          ne(Requests.UserID, params.user.ID),
          eq(Events.UserID, params.user.ID),
        ),
      )
      .orderBy(Requests.CreatedAt)
      .limit(params.options.limit ?? 10)
      .offset(params.options.offset ?? 0)
      .execute();
  } catch (e) {
    console.log(e);
    return null;
  }
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
  })
    .from(Events)
    .innerJoin(Requests, eq(Events.EventID, Requests.EventID))
    .where(
      and(
        eq(Requests.Status, "confirmed"),
        // comment this for testing
        ne(Requests.UserID, params.user.ID),
        or(
          eq(Requests.UserID, params.user.ID),
          eq(Events.UserID, params.user.ID),
        ),
      ),
    )
    .groupBy(Events.EventID)
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
        and(
          eq(Events.UserID, params.user.ID),
          eq(Requests.Status, "pending"),
          //comment this line for testing
          ne(Requests.UserID, params.user.ID),
        ),
      )
      .execute();
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
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null)
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
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null)
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
