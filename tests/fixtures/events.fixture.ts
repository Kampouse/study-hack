import { testDb, getFutureDate, getFutureTime, getPastDate } from "../setup";
import { Events, NewEvent } from "../../drizzle/schema";
import { faker } from "@faker-js/faker";

/**
 * Create a test event with optional overrides
 */
export async function createTestEvent(
  userId: number,
  overrides?: Partial<NewEvent>,
) {
  const defaultEvent: NewEvent = {
    Name: faker.company.catchPhrase(),
    Description: faker.lorem.paragraph(),
    Location: faker.location.streetAddress(),
    ImageURL: faker.image.url(),
    Coordinates: [
      Number(faker.location.latitude()),
      Number(faker.location.longitude()),
    ] as [number, number],
    Date: getFutureDate(7),
    StartTime: "14:00",
    EndTime: "16:00",
    Tags: ["studying", "group-work"],
    UserID: userId,
  };

  const eventData = { ...defaultEvent, ...overrides };

  const result = await testDb.insert(Events).values(eventData).returning();
  return result[0];
}

/**
 * Create multiple test events for a user
 */
export async function createTestEvents(
  userId: number,
  count: number,
  overrides?: Partial<NewEvent>,
) {
  const events = [];
  for (let i = 0; i < count; i++) {
    const event = await createTestEvent(userId, overrides);
    events.push(event);
  }
  return events;
}

/**
 * Pre-defined test events for consistent testing
 */
export const TEST_EVENTS = {
  studySession: {
    Name: "Math Study Session",
    Description: "Group study for Calculus II midterm",
    Location: "Campus Library Room 301",
    Tags: ["math", "calculus", "exam-prep"],
    Date: getFutureDate(3),
    StartTime: "14:00",
    EndTime: "17:00",
  },
  codingWorkshop: {
    Name: "Python Coding Workshop",
    Description: "Learn advanced Python concepts",
    Location: "Computer Lab B",
    Tags: ["programming", "python", "workshop"],
    Date: getFutureDate(5),
    StartTime: "10:00",
    EndTime: "13:00",
  },
  examReview: {
    Name: "Final Exam Review",
    Description: "Comprehensive review session",
    Location: "Lecture Hall A",
    Tags: ["exam-prep", "review", "finals"],
    Date: getFutureDate(10),
    StartTime: "18:00",
    EndTime: "20:00",
  },
} as const;

/**
 * Create a past event (for testing validation)
 */
export async function createPastEvent(
  userId: number,
  overrides?: Partial<NewEvent>,
) {
  return createTestEvent(userId, {
    Date: getPastDate(3),
    StartTime: "14:00",
    EndTime: "16:00",
    ...overrides,
  });
}

/**
 * Create a future event
 */
export async function createFutureEvent(
  userId: number,
  daysAhead: number = 7,
  overrides?: Partial<NewEvent>,
) {
  return createTestEvent(userId, {
    Date: getFutureDate(daysAhead),
    StartTime: getFutureTime(),
    ...overrides,
  });
}

/**
 * Create event happening today
 */
export async function createTodayEvent(
  userId: number,
  overrides?: Partial<NewEvent>,
) {
  const today = new Date().toISOString().split("T")[0];
  return createTestEvent(userId, {
    Date: today,
    StartTime: "20:00", // Late today
    EndTime: "22:00",
    ...overrides,
  });
}
