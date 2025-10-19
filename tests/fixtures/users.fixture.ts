import { testDb } from "../setup";
import { Users, NewUser } from "../../drizzle/schema";
import { faker } from "@faker-js/faker";

/**
 * Create a test user with optional overrides
 */
export async function createTestUser(overrides?: Partial<NewUser>) {
  const defaultUser: NewUser = {
    Username: faker.internet
      .userName()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, ""),
    Name: faker.person.fullName(),
    Email: faker.internet.email().toLowerCase(),
    ImageURL: faker.image.avatar(),
    Description: faker.lorem.sentence(),
    IsAdmin: 0,
    Intrestets: ["studying", "coding", "reading"],
  };

  const userData = { ...defaultUser, ...overrides };

  const result = await testDb.insert(Users).values(userData).returning();
  return result[0];
}

/**
 * Create multiple test users
 */
export async function createTestUsers(
  count: number,
  overrides?: Partial<NewUser>,
) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await createTestUser(overrides);
    users.push(user);
  }
  return users;
}

/**
 * Pre-defined test users for consistent testing
 */
export const TEST_USERS = {
  alice: {
    Username: "alice_test",
    Name: "Alice Anderson",
    Email: "alice@test.com",
    Description: "Computer Science student",
    Intrestets: ["algorithms", "machine-learning", "databases"] as string[],
  },
  bob: {
    Username: "bob_test",
    Name: "Bob Brown",
    Email: "bob@test.com",
    Description: "Math major",
    Intrestets: ["calculus", "statistics", "physics"] as string[],
  },
  charlie: {
    Username: "charlie_test",
    Name: "Charlie Chen",
    Email: "charlie@test.com",
    Description: "Biology enthusiast",
    Intrestets: ["biology", "chemistry", "research"] as string[],
  },
  admin: {
    Username: "admin_test",
    Name: "Admin User",
    Email: "admin@test.com",
    IsAdmin: 1,
    Description: "System administrator",
    Intrestets: ["system-administration"] as string[],
  },
};

/**
 * Create Alice, Bob, Charlie test users
 */
export async function createStandardTestUsers() {
  const alice = await createTestUser(TEST_USERS.alice);
  const bob = await createTestUser(TEST_USERS.bob);
  const charlie = await createTestUser(TEST_USERS.charlie);

  return { alice, bob, charlie };
}
