import { testDb } from "../setup";
import { Requests, JoinEvent } from "../../drizzle/schema";
import { faker } from "@faker-js/faker";

/**
 * Create a test join request with optional overrides
 */
export async function createTestRequest(
  eventId: number,
  userId: number,
  overrides?: Partial<JoinEvent>,
) {
  const defaultRequest: JoinEvent = {
    EventID: eventId,
    UserID: userId,
    Status: "pending",
    Background: faker.lorem.sentence(),
    Experience: faker.lorem.paragraph(),
    WhyJoin: faker.lorem.paragraph(),
  };

  const requestData = { ...defaultRequest, ...overrides };

  const result = await testDb.insert(Requests).values(requestData).returning();
  return result[0];
}

/**
 * Create multiple test requests for an event
 */
export async function createTestRequests(
  eventId: number,
  userIds: number[],
  overrides?: Partial<JoinEvent>,
) {
  const requests = [];
  for (const userId of userIds) {
    const request = await createTestRequest(eventId, userId, overrides);
    requests.push(request);
  }
  return requests;
}

/**
 * Create a pending request
 */
export async function createPendingRequest(eventId: number, userId: number) {
  return createTestRequest(eventId, userId, { Status: "pending" });
}

/**
 * Create a confirmed/approved request
 */
export async function createConfirmedRequest(eventId: number, userId: number) {
  return createTestRequest(eventId, userId, { Status: "confirmed" });
}

/**
 * Create a rejected request
 */
export async function createRejectedRequest(eventId: number, userId: number) {
  return createTestRequest(eventId, userId, { Status: "rejected" });
}

/**
 * Pre-defined test request data
 */
export const TEST_REQUESTS = {
  eager: {
    Background: "I have been studying this subject for 2 years",
    Experience: "Completed related courses with high grades",
    WhyJoin: "I want to learn from others and share my knowledge",
  },
  beginner: {
    Background: "Just starting out in this field",
    Experience: "Limited experience but very motivated",
    WhyJoin: "Looking to learn from experienced students",
  },
  experienced: {
    Background: "Senior student with extensive background",
    Experience: "Multiple years of hands-on experience",
    WhyJoin: "Want to help others and collaborate on advanced topics",
  },
} as const;
