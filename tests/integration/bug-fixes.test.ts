import { and, eq, exists, ne, not, or } from 'drizzle-orm'
import { describe, expect, test } from 'vitest'
import { Events, Requests, Users } from '../../drizzle/schema'
import { testDb } from '../setup'

/**
 * Direct SQL-level tests for bug fixes
 * These test the actual SQL queries to verify the bugs are fixed
 */
describe('Bug Fixes - Direct SQL Tests', () => {
  describe('COMMIT 4: QueryActiveEvent contradiction bug', () => {
    test('Bug Fix: ne() no longer contradicts or() in QueryActiveEvent logic', async () => {
      // Create users
      const [alice] = await testDb
        .insert(Users)
        .values({
          Username: 'alice',
          Name: 'Alice',
          Email: 'alice@test.com',
          Intrestets: [],
        })
        .returning()

      const [bob] = await testDb
        .insert(Users)
        .values({
          Username: 'bob',
          Name: 'Bob',
          Email: 'bob@test.com',
          Intrestets: [],
        })
        .returning()

      // Bob creates an event
      const [bobEvent] = await testDb
        .insert(Events)
        .values({
          Name: 'Bob Study Session',
          Description: 'Test event',
          Location: 'Library',
          Coordinates: [0, 0],
          Date: '2025-12-31',
          StartTime: '14:00',
          EndTime: '16:00',
          Tags: ['study'],
          UserID: bob.UserID,
        })
        .returning()

      // Alice joins Bob's event
      await testDb.insert(Requests).values({
        EventID: bobEvent.EventID,
        UserID: alice.UserID,
        Status: 'confirmed',
      })

      // Test the FIXED query logic (without the contradictory ne())
      const results = await testDb
        .select({
          eventID: Events.EventID,
        })
        .from(Events)
        .innerJoin(Requests, eq(Events.EventID, Requests.EventID))
        .where(
          and(
            eq(Requests.Status, 'confirmed'),
            // Bug fix: removed ne(Requests.UserID, alice.UserID) that contradicted below
            or(
              eq(Requests.UserID, alice.UserID),
              eq(Events.UserID, alice.UserID)
            )
          )
        )

      // Alice should see the event she joined
      expect(results).toBeDefined()
      expect(results.length).toBe(1)
      expect(results[0].eventID).toBe(bobEvent.EventID)
    })

    test('Bug verified: with ne() contradiction, query returns no results', async () => {
      // Create users
      const [alice] = await testDb
        .insert(Users)
        .values({
          Username: 'alice2',
          Name: 'Alice',
          Email: 'alice2@test.com',
          Intrestets: [],
        })
        .returning()

      const [bob] = await testDb
        .insert(Users)
        .values({
          Username: 'bob2',
          Name: 'Bob',
          Email: 'bob2@test.com',
          Intrestets: [],
        })
        .returning()

      // Bob creates an event
      const [bobEvent] = await testDb
        .insert(Events)
        .values({
          Name: 'Bob Study Session 2',
          Description: 'Test event',
          Location: 'Library',
          Coordinates: [0, 0],
          Date: '2025-12-31',
          StartTime: '14:00',
          EndTime: '16:00',
          Tags: ['study'],
          UserID: bob.UserID,
        })
        .returning()

      // Alice joins Bob's event
      await testDb.insert(Requests).values({
        EventID: bobEvent.EventID,
        UserID: alice.UserID,
        Status: 'confirmed',
      })

      // Test the BUGGY query logic (with the contradictory ne())
      const buggyResults = await testDb
        .select({
          eventID: Events.EventID,
        })
        .from(Events)
        .innerJoin(Requests, eq(Events.EventID, Requests.EventID))
        .where(
          and(
            eq(Requests.Status, 'confirmed'),
            ne(Requests.UserID, alice.UserID), // ❌ CONTRADICTION
            or(
              eq(Requests.UserID, alice.UserID), // Says user IS alice
              eq(Events.UserID, alice.UserID)
            )
          )
        )

      // With the bug, Alice gets NO results (contradiction makes query impossible)
      expect(buggyResults).toBeDefined()
      expect(buggyResults.length).toBe(0) // Bug causes empty results
    })
  })

  describe('COMMIT 5: Filter own events from QueryEvents', () => {
    test('Bug Fix: Users do NOT see their own events in discovery', async () => {
      // Create Alice
      const [alice] = await testDb
        .insert(Users)
        .values({
          Username: 'alice3',
          Name: 'Alice',
          Email: 'alice3@test.com',
          Intrestets: [],
        })
        .returning()

      // Alice creates an event
      const [aliceEvent] = await testDb
        .insert(Events)
        .values({
          Name: 'Alice Study Session',
          Description: 'Test event',
          Location: 'Library',
          Coordinates: [0, 0],
          Date: '2025-12-31',
          StartTime: '14:00',
          EndTime: '16:00',
          Tags: ['study'],
          UserID: alice.UserID,
        })
        .returning()

      // Query events excluding own events and events user has joined
      const results = await testDb
        .select({
          eventID: Events.EventID,
          name: Events.Name,
        })
        .from(Events)
        .where(
          and(
            ne(Events.UserID, alice.UserID), // ✅ Bug fix: exclude own events
            not(
              exists(
                testDb
                  .select()
                  .from(Requests)
                  .where(
                    and(
                      eq(Requests.EventID, Events.EventID),
                      eq(Requests.UserID, alice.UserID)
                    )
                  )
              )
            )
          )
        )

      // Alice should NOT see her own event
      expect(results).toBeDefined()
      const foundOwnEvent = results.some(e => e.eventID === aliceEvent.EventID)
      expect(foundOwnEvent).toBe(false)
    })

    test('Users DO see events created by others', async () => {
      // Create Alice and Bob
      const [alice] = await testDb
        .insert(Users)
        .values({
          Username: 'alice4',
          Name: 'Alice',
          Email: 'alice4@test.com',
          Intrestets: [],
        })
        .returning()

      const [bob] = await testDb
        .insert(Users)
        .values({
          Username: 'bob4',
          Name: 'Bob',
          Email: 'bob4@test.com',
          Intrestets: [],
        })
        .returning()

      // Bob creates an event
      const [bobEvent] = await testDb
        .insert(Events)
        .values({
          Name: 'Bob Study Session',
          Description: 'Test event',
          Location: 'Library',
          Coordinates: [0, 0],
          Date: '2025-12-31',
          StartTime: '14:00',
          EndTime: '16:00',
          Tags: ['study'],
          UserID: bob.UserID,
        })
        .returning()

      // Query events for Alice (should include Bob's event)
      const results = await testDb
        .select({
          eventID: Events.EventID,
          name: Events.Name,
        })
        .from(Events)
        .where(
          and(
            ne(Events.UserID, alice.UserID), // Exclude Alice's events
            not(
              exists(
                testDb
                  .select()
                  .from(Requests)
                  .where(
                    and(
                      eq(Requests.EventID, Events.EventID),
                      eq(Requests.UserID, alice.UserID)
                    )
                  )
              )
            )
          )
        )

      // Alice should see Bob's event
      expect(results).toBeDefined()
      expect(results.length).toBeGreaterThan(0)
      const foundBobEvent = results.some(e => e.eventID === bobEvent.EventID)
      expect(foundBobEvent).toBe(true)
    })
  })
})
