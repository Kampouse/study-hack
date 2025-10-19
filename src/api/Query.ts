import { Users, Events, Requests, Places } from "../../drizzle/schema";
import type { Session } from "./drizzled";
import { eq, and, ne, or, not, exists, sql, notInArray } from "drizzle-orm";
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

export const QueryPlaces = async (params: {
  event: Requested | undefined;
  client?: ClientType | null;
  params?: { limit?: number; offset?: number; exclude?: number[] };
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "places not found",
    };
  }

  try {
    const lenght = (await Client.select().from(Places)).length;
    let offset = params.params?.offset ?? 0;

    offset = offset == lenght ? 0 : offset;

    const result = await Client.select()
      .from(Places)
      .fullJoin(Users, eq(Users.UserID, Places.UserID))
      .where(
        and(
          eq(Places.IsPublic, 1),
          params.params?.exclude
            ? notInArray(Places.PlaceID, params.params.exclude)
            : undefined,
        ),
      )
      .orderBy(sql`RANDOM()`)
      .limit(params.params?.limit ?? 100)
      .offset(offset)
      .execute();

    if (result.length === 0) {
      return {
        success: false,
        message: "no places found",
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error getting a place:", error);
    return {
      success: false,
      message: "Error getting a place",
    };
  }
};
export const QueryUserPlaces = async (params: {
  event: Requested | undefined;
  user: GetUserReturnType;
  client?: ClientType | null;
  params?: { limit?: number; offset?: number };
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
      data: null,
    };
  }
  if (!params.user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  try {
    const places = await Client.select()
      .from(Places)
      .where(eq(Places.UserID, params.user.ID))
      .limit(params.params?.limit ?? 100)
      .offset(params.params?.offset ?? 0)
      .execute();

    if (places.length === 0) {
      return {
        success: false,
        message: "No places found for this user",
        data: [],
      };
    }

    return {
      success: true,
      message: "Places retrieved successfully",
      data: places,
    };
  } catch (error) {
    console.error("Error retrieving user places:", error);
    return {
      success: false,
      message: "Error retrieving user places",
      data: null,
    };
  }
};
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
  const data = serverSession(params.event);
  console.log("User intrests:", params.session.Intrests);
  if (data !== null) {
    await Client.update(Users)
      .set({
        Name: params.session.Name,
        Username: params.session.Username,
        Description: params.session.Description,
        Intrestets: params.session.Intrests,
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

export const GetUser = async (params: {
  event: Requested;
  userId?: string | undefined;
}) => {
  const Client = await drizzler(params.event);
  const data = serverSession(params.event);
  if (data !== null && Client !== null && !params.userId) {
    try {
      const userData = await Client.select({
        ID: Users.UserID,
        Name: Users.Name,
        Username: Users.Username,

        Description: Users.Description,
        Image: Users.ImageURL,
        Intrests: Users.Intrestets,
      })
        .from(Users)
        .where(eq(Users.Email, data.user.email))
        .execute();

      if (userData.length > 0) {
        return userData[0];
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  } else if (params.userId && Client != null) {
    try {
      const userData = await Client.select({
        ID: Users.UserID,
        Name: Users.Name,
        Username: Users.Username,
        Description: Users.Description,
        Image: Users.ImageURL,
        Intrests: Users.Intrestets,
      })
        .from(Users)
        .where(eq(Users.UserID, parseInt(params.userId)))
        .execute();
      if (userData.length > 0) {
        return userData[0];
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  return null;
};

export const QueryUserStats = async (params: {
  event: Requested | undefined;
  user: GetUserReturnType;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
      data: null,
    };
  }

  try {
    if (!params.user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }
    // Count events created by the user
    // Execute all database queries concurrently using Promise.all
    const [eventsCreated, placesCreated, eventsAttended] = await Promise.all([
      Client.select({ count: sql`count(*)` })
        .from(Events)
        .where(eq(Events.UserID, params.user.ID))
        .execute(),

      Client.select({ count: sql`count(*)` })
        .from(Places)
        .where(eq(Places.UserID, params.user.ID))
        .execute(),

      Client.select({ count: sql`count(*)` })
        .from(Requests)
        .where(
          and(
            eq(Requests.UserID, params.user.ID),
            eq(Requests.Status, "confirmed"),
          ),
        )
        .execute(),
    ]);

    return {
      success: true,
      message: "User stats retrieved successfully",
      data: {
        eventsCreated: Number(eventsCreated[0]?.count || 0),
        placesCreated: Number(placesCreated[0]?.count || 0),
        eventsAttended: Number(eventsAttended[0]?.count || 0),
      },
    };
  } catch (error) {
    console.error("Error retrieving user stats:", error);
    return {
      success: false,
      message: "Error retrieving user stats",
      data: null,
    };
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
  if (Client === null || userData === null) return;
  return await Client.insert(Events)
    .values({
      Name: params.session.Name,
      Description: params.session.Description,
      Location: params.session.Location,
      Coordinates: params.session.Coordinates,
      Date: params.session.Date,
      PlaceId: params.session.PlaceId,
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
  fromDateTime?: Date;
};

export const QueryEvent = async (params: {
  event: Requested;
  id: number;
  options: QueryEventOptions | undefined;
}) => {
  const Client = params.options?.client || (await drizzler(params.event));

  if (Client === null) return;

  const event = await Client.select({
    name: Events.Name,
    description: Events.Description,
    location: Events.Location,
    LocationID: Events.PlaceId,
    coordinates: Events.Coordinates,
    date: Events.Date,
    starttime: Events.StartTime,
    endtime: Events.EndTime,
    tags: Events.Tags,
    eventID: Events.EventID,
    userID: Events.UserID,
    image: Events.ImageURL,
  })
    .from(Events)
    .where(and(eq(Events.EventID, params.id)))

    .execute()
    .catch((e) => {
      console.log(e);
      return null;
    });
  if (event && event.length > 0) {
    const user = await Client.select()
      .from(Users)
      .where(eq(Users.UserID, event[0].userID))
      .execute();

    const loc = await Client.select()
      .from(Places)
      .where(eq(Places.PlaceID, event[0].LocationID as number));

    // Use place image if event doesn't have one
    const eventWithImage = {
      ...event[0],
      image: event[0].image || loc[0]?.ImageURL || "",
    };

    return { user: user[0], event: eventWithImage, location: loc[0] };
  }
};
//query events that are not created by the user and not registered by the user
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
    placeId: Events.PlaceId,
    eventID: Events.EventID,
    image: Events.ImageURL,
    userID: Events.UserID,
    creator: Users.Username,
  })
    .from(Events)
    .leftJoin(Users, eq(Users.UserID, Events.UserID))
    .where(
      and(
        not(
          exists(
            Client.select()
              .from(Requests)
              .where(
                and(
                  eq(Requests.EventID, Events.EventID),
                  eq(Requests.UserID, params.options.byUser as number),
                ),
              ),
          ),
        ),
      ),
    )
    .limit(params.options.limit ?? 3)
    .offset(params.options.offset ?? 0)
    .execute()

    .catch((e) => {
      console.log(e);
      return null;
    });

  const result =
    output?.map(async (event) => {
      const requests = await Client.select()
        .from(Requests)
        .where(
          and(
            eq(Requests.EventID, event.eventID),
            eq(Requests.Status, "confirmed"),
          ),
        )
        .execute();

      return {
        eventID: event.eventID,
        confirmedCount: requests.length,
      };
    }) ?? [];
  const places = await QueryPlaces({ event: params.event, client: Client });
  const resultEvents = await Promise.all(result);
  if (places.success && places.data) {
    return output?.map((event) => {
      const eventPlace = places.data.find(
        (place) => place.Places?.PlaceID === event.placeId,
      );
      return {
        ...event,
        image: event.image || eventPlace?.Places?.ImageURL || "",
        attendees: resultEvents.find((e) => e.eventID === event.eventID)
          ?.confirmedCount,
        place: eventPlace,
      };
    });
  }

  return null;
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
    startTime: Events.StartTime,
    endtime: Events.EndTime,
    tags: Events.Tags,
    placeId: Events.PlaceId,
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
      statTime: Events.StartTime,
      placeId: Events.PlaceId,
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
    .where(eq(Requests.UserID, params.UserID));
  const mergedEvents = [
    ...hostedEvents.map((event) => ({ ...event, role: "host" })),
    ...attendingEvents.map(({ event, request }) => ({
      ...event,
      ...request,
      role: request.status === "confirmed" ? "confirmed" : "pending",
    })),
  ];

  mergedEvents.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Fetch all places to use for image fallback
  const places = await QueryPlaces({ event: params.event, client: Client });

  const processedEvents = await Promise.all(
    mergedEvents.map(async (event) => {
      const date = new Date(event.date);
      const startTime = event.startTime;
      const hrs = startTime ? startTime.split(":")[0] : "00";
      const minutes = startTime ? startTime.split(":")[1] : "00";
      const ampm = parseInt(hrs) >= 12 ? "PM" : "AM";
      const formattedHours = parseInt(hrs) % 12 || 12;
      event.date = `${date.toLocaleDateString()} at ${formattedHours}:${minutes} ${ampm}`;

      const res = await Client.select({
        requestID: Requests.RequestID,
        eventID: Requests.EventID,
        background: Requests.Background,
        experience: Requests.Experience,
        whyJoin: Requests.WhyJoin,
        status: Requests.Status,
        createdAt: Requests.CreatedAt,
      })
        .from(Requests)
        .where(
          and(
            eq(Requests.EventID, event.eventID),
            eq(Requests.Status, "confirmed"),
          ),
        )
        .groupBy(Requests.EventID);

      // Use place image if event doesn't have one
      const eventPlace =
        places.success && places.data
          ? places.data.find((place) => place.Places?.PlaceID === event.placeId)
          : null;
      const finalImage = event.image || eventPlace?.Places?.ImageURL || "";

      return {
        ...event,
        image: finalImage,
        attendees: res.length,
        requests: res,
      };
    }),
  );

  return processedEvents;
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

  const result = await Client.select({
    name: Events.Name,
    description: Events.Description,
    location: Events.Location,
    coordinates: Events.Coordinates,
    date: Events.Date,
    starttime: Events.StartTime,
    endtime: Events.EndTime,
    tags: Events.Tags,
    placeId: Events.PlaceId,
    eventID: Events.EventID,
    image: Events.ImageURL,
  })
    .from(Events)
    .innerJoin(Requests, eq(Events.EventID, Requests.EventID))
    .where(
      and(
        eq(Requests.Status, "confirmed"),
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

  return result;
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
export const CreatePlace = async (params: {
  event: Requested | undefined;
  userID: number;
  placeData: {
    name: string;
    address: string;
    image?: string;
    description: string;
    tags?: string[];
    rating: string;
    wifispeed?: number;
    hasquietenvironment?: boolean;
    price?: string;
    coordinates?: [number, number];
    category?: string;
  };
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
    };
  }

  try {
    const result = await Client.insert(Places)
      .values({
        UserID: params.userID,
        Name: params.placeData.name,
        Address: params.placeData.address,
        ImageURL: params.placeData.image || "",
        Description: params.placeData.description,
        Tags: params.placeData.tags || [],
        Rating: parseFloat(params.placeData.rating),
        WifiSpeed: params.placeData.wifispeed || 0,
        HasQuietEnvironment: params.placeData.hasquietenvironment ? 1 : 0,
        Coordinates: params.placeData.coordinates || [0, 0],
        IsPublic: 1,
      })
      .returning()
      .execute();
    return {
      data: result[0],
      success: true,
      message: "Place created successfully",
    };
  } catch (error) {
    console.error("Error creating place:", error);
    return {
      success: false,
      message: "Error creating place",
    };
  }
};

export const UpdatePlace = async (params: {
  event: Requested | undefined;
  placeId: number;
  placeData: Partial<{
    name: string;
    address: string;
    image?: string;
    description: string;
    tags?: string[];
    rating: number;
    wifiSpeed?: number;
    lat: number;
    lng: number;
    hasQuietEnvironment?: boolean;
  }>;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
    };
  }

  try {
    const result = await Client.update(Places)
      .set({
        Name: params.placeData.name,
        Address: params.placeData.address,
        ImageURL: params.placeData.image,
        Description: params.placeData.description,
        Tags: params.placeData.tags,
        Rating: params.placeData.rating,
        WifiSpeed: params.placeData.wifiSpeed,
        HasQuietEnvironment: params.placeData.hasQuietEnvironment ? 1 : 0,
        Coordinates:
          params.placeData.lat && params.placeData.lng
            ? [params.placeData.lat, params.placeData.lng]
            : undefined,
      })
      .where(eq(Places.PlaceID, params.placeId))
      .returning()
      .execute();

    if (result.length === 0) {
      return {
        success: false,
        message: "Place not found",
      };
    }

    return {
      data: result[0],
      success: true,
      message: "Place updated successfully",
    };
  } catch (error) {
    console.error("Error updating place:", error);
    return {
      success: false,
      message: "Error updating place",
    };
  }
};
export const QueryPlace = async (params: {
  event: Requested | undefined;
  name?: string;
  placeId?: number;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
    };
  }
  try {
    if (params.name && params.name !== "") {
      const result = await Client.select()
        .from(Places)
        .where(eq(Places.Name, params.name))
        .execute();

      if (result.length === 0) {
        return {
          success: false,
          message: "Place not found",
        };
      }

      return {
        success: true,
        data: { ...result[0] },
      };
    }
    if (params.placeId) {
      console.log(params.placeId);
      const result = await Client.select()
        .from(Places)
        .where(eq(Places.PlaceID, params.placeId))
        .execute();

      if (result.length === 0) {
        return {
          success: false,
          message: "Place not found",
        };
      }

      return {
        success: true,
        data: { ...result[0] },
      };
    }
  } catch (error) {
    console.error("Error getting a place:", error);
    return {
      success: false,
      message: "invalid request",
    };
  }
  return {
    success: true,
    data: null,
    message: "Place retrieved successfully",
  };
};
export const DeletePlace = async (params: {
  event: Requested | undefined;
  placeId: number;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
    };
  }

  try {
    const result = await Client.delete(Places)
      .where(eq(Places.PlaceID, params.placeId))
      .returning()
      .execute();

    if (result.length === 0) {
      return {
        success: false,
        message: "Place not found",
      };
    }

    return {
      success: true,
      message: "Place deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting place:", error);
    return {
      success: false,
      message: "Error deleting place",
    };
  }
};
export const QueryConfirmedUsers = async (params: {
  event: Requested | undefined;
  eventId: number;
  client?: ClientType | null;
}) => {
  const Client = params.client ?? (await drizzler(params.event as Requested));
  if (Client === null) {
    return {
      success: false,
      message: "Client not found",
      data: null,
    };
  }

  try {
    const requests = await Client.select({
      requestId: Requests.RequestID,
      userId: Requests.UserID,
      status: Requests.Status,
      background: Requests.Background,
      experience: Requests.Experience,
      whyJoin: Requests.WhyJoin,
      createdAt: Requests.CreatedAt,
      user: {
        name: Users.Name,
        email: Users.Email,
        image: Users.ImageURL,
        description: Users.Description,
      },
    })
      .from(Requests)
      .leftJoin(Users, eq(Users.UserID, Requests.UserID))
      .where(
        and(
          eq(Requests.EventID, params.eventId),
          eq(Requests.Status, "confirmed"),
        ),
      )
      .execute();

    return {
      success: true,
      message: "Requests found",
      data: requests,
    };
  } catch (error) {
    console.error("Error getting requests:", error);
    return {
      success: false,
      message: "Error getting requests",
      data: null,
    };
  }
};
