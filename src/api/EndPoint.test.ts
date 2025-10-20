import { expect, test } from 'vitest'
import { testDb } from '../../tests/setup'
import {
  CreateEvent,
  CreatePlace,
  CreateUser,
  DeletePlace,
  GetUserFromEmail,
  QueryAllReferenceEvents,
  QueryPlace,
  QueryPlaces,
  UpdatePlace,
  createJoinRequest,
  updateRequestStatus,
} from './Query'

import { faker } from '@faker-js/faker'
test('Create a valid user', async () => {
  const result = await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })
  expect(result).toBeDefined()
})

test('Get user from email', async () => {
  // First create a user
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  // Then get the user
  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })
  expect(user).toBeDefined()
  expect(user?.Email).toBe('jpmartel98@gmail.com')
})

test('add valid event from user', async () => {
  // First create a user
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  const event = {
    Name: faker.lorem.words(3),
    Description: faker.lorem.paragraph(),
    Date: faker.date.future().toISOString().split('T')[0],
    StartTime: faker.date.future().toLocaleTimeString(),
    EndTime: faker.date.future().toLocaleTimeString(),
    Location: faker.location.city(),
    ImageURL: faker.image.url() as string,
    Coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  }
  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })

  type userData = {
    ID: number
    Name: string
    Intrests: string
    Description: string
    Image: string
  }

  const userData = {
    ID: user?.ID as number,
    Name: user?.Name as string,
    Username: user?.Username as string,
    Intrests: user?.Intrests as string[],
    Description: user?.Description as string,
    Image: user?.ImageURL as string,
  }

  const output = await CreateEvent({
    event: undefined,
    session: event,
    userData: userData,
    Client: testDb as any,
  })
  expect(output).toBeDefined()
  if (output) {
    expect(output[0]).toHaveProperty('EventID')
  }
})

test('Create a join request', async () => {
  // Create event owner
  await CreateUser({
    event: undefined,
    session: {
      name: 'EventOwner',
      user: {
        name: 'EventOwner',
        email: 'owner@example.com',
        image: 'owner_image.jpg',
      },
    },
    client: testDb as any,
  })
  const eventOwner = await GetUserFromEmail({
    event: undefined,
    email: 'owner@example.com',
    client: testDb as any,
  })

  // Create requester (different user)
  await CreateUser({
    event: undefined,
    session: {
      name: 'Requester',
      user: {
        name: 'Requester',
        email: 'requester@example.com',
        image: 'requester_image.jpg',
      },
    },
    client: testDb as any,
  })
  const queriedUser = await GetUserFromEmail({
    event: undefined,
    email: 'requester@example.com',
    client: testDb as any,
  })

  expect(queriedUser).toBeDefined()
  expect(queriedUser?.Email).toBe('requester@example.com')

  // Event owner creates an event
  const event = {
    Name: faker.lorem.words(3),
    Description: faker.lorem.paragraph(),
    Date: faker.date.future().toISOString().split('T')[0],
    StartTime: faker.date.future().toLocaleTimeString(),
    EndTime: faker.date.future().toLocaleTimeString(),
    Location: faker.location.city(),
    ImageURL: faker.image.url() as string,
    Coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  }

  const createdEvent = await CreateEvent({
    event: undefined,
    session: event,
    userData: eventOwner as any,
    Client: testDb as any,
  })

  expect(createdEvent).toBeDefined()
  expect(createdEvent?.[0]).toHaveProperty('EventID')

  // Requester (different user) creates a join request
  const joinRequest = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent?.[0].EventID as number,
      userId: queriedUser?.ID as number,
      background: faker.lorem.paragraph(),
      experience: faker.lorem.paragraph(),
      why: faker.lorem.paragraph(),
    },
    client: testDb as any,
  })

  expect(joinRequest).toBeDefined()
  if (!joinRequest.success) {
    console.log('Join request failed:', joinRequest.message)
  }
  expect(joinRequest.success).toBe(true)
  expect(joinRequest.data).toHaveProperty('RequestID')
  expect(joinRequest.data?.EventID).toBe(createdEvent?.[0].EventID)
  expect(joinRequest.data?.UserID).toBe(queriedUser?.ID)

  // Update the request status
  const updatedRequest = await updateRequestStatus({
    event: undefined,
    requestId: joinRequest.data?.RequestID as number,
    newStatus: 'confirmed',
    client: testDb as any,
  })

  expect(updatedRequest).toBeDefined()
  expect(updatedRequest.success).toBe(true)
  expect(updatedRequest.data?.Status).toBe('confirmed')
})
test('QueryAllReferenceEvents - validity of data', async () => {
  // Create users
  await CreateUser({
    event: undefined,
    session: {
      name: 'User1',
      user: {
        name: 'User1',
        email: 'user1@example.com',
        image: 'user1_image.jpg',
      },
    },
    client: testDb as any,
  })

  await CreateUser({
    event: undefined,
    session: {
      name: 'User2',
      user: {
        name: 'User2',
        email: 'user2@example.com',
        image: 'user2_image.jpg',
      },
    },
    client: testDb as any,
  })

  // Get users from email
  const user1 = await GetUserFromEmail({
    event: undefined,
    email: 'user1@example.com',
    client: testDb as any,
  })

  const user2 = await GetUserFromEmail({
    event: undefined,
    email: 'user2@example.com',
    client: testDb as any,
  })

  expect(user1).toBeDefined()
  expect(user2).toBeDefined()

  // Create events (set date to tomorrow to ensure they're in the future)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const futureDate = tomorrow.toISOString().split('T')[0]

  const event1 = {
    Name: 'Test Event 1',
    Description: 'This is test event 1',
    Date: futureDate,
    StartTime: '10:00:00',
    EndTime: '12:00:00',
    Location: 'Test Location 1',
    ImageURL: 'test_image1.jpg',
    Coordinates: [0, 0] as [number, number],
  }

  const event2 = {
    Name: 'Test Event 2',
    Description: 'This is test event 2',
    Date: futureDate,
    StartTime: '14:00:00',
    EndTime: '16:00:00',
    Location: 'Test Location 2',
    ImageURL: 'test_image2.jpg',
    Coordinates: [1, 1] as [number, number],
  }

  const createdEvent1 = await CreateEvent({
    event: undefined,
    session: event1,
    userData: user1 as any,
    Client: testDb as any,
  })

  const createdEvent2 = await CreateEvent({
    event: undefined,
    session: event2,
    userData: user2 as any,
    Client: testDb as any,
  })

  expect(createdEvent1).toBeDefined()
  expect(createdEvent1?.[0]).toHaveProperty('EventID')
  expect(createdEvent2).toBeDefined()
  expect(createdEvent2?.[0]).toHaveProperty('EventID')

  // Create join requests
  const joinRequest1 = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent1?.[0].EventID as number,
      userId: user2?.ID as number,
      background: 'Test background 1',
      experience: 'Test experience 1',
      why: 'Test reason 1',
    },
    client: testDb as any,
  })

  const joinRequest2 = await createJoinRequest({
    event: undefined,
    requestData: {
      eventId: createdEvent2?.[0].EventID as number,
      userId: user1?.ID as number,
      background: 'Test background 2',
      experience: 'Test experience 2',
      why: 'Test reason 2',
    },
    client: testDb as any,
  })

  expect(joinRequest1).toBeDefined()
  expect(joinRequest1.success).toBe(true)
  expect(joinRequest2).toBeDefined()
  expect(joinRequest2.success).toBe(true)

  // Query all reference events for user1
  const dataFromUser1 = await QueryAllReferenceEvents({
    event: undefined as any,
    UserID: user1?.ID as number,
    options: {
      client: testDb as any,
    },
  })

  expect(dataFromUser1).toBeDefined()
  expect(dataFromUser1).toBeInstanceOf(Array)
  expect(dataFromUser1?.length).toBeGreaterThanOrEqual(2)

  // Query all reference events for user2
  const dataFromUser2 = await QueryAllReferenceEvents({
    event: undefined as any,
    UserID: user2?.ID as number,
    options: {
      client: testDb as any,
    },
  })

  expect(dataFromUser2).toBeDefined()
  expect(dataFromUser2).toBeInstanceOf(Array)
  expect(dataFromUser2?.length).toBeGreaterThanOrEqual(2)
})
test('Create a valid place', async () => {
  // First create a user
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    image: faker.image.url(),
    description: faker.lorem.paragraph(),
    tags: [faker.word.sample(), faker.word.sample()],
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    wifispeed: faker.number.int({ min: 1, max: 100 }),
    hasquietenvironment: faker.datatype.boolean(),
    price: '$'.repeat(faker.number.int({ min: 1, max: 3 })),
    category: faker.word.sample(),
  }

  const result = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: testDb as any,
  })

  expect(result).toBeDefined()
  expect(result.success).toBe(true)
  expect(result.data).toHaveProperty('PlaceID')
})

test('Query a specific place', async () => {
  // First create a user
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  }

  const createdPlace = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: testDb as any,
  })
  expect(createdPlace).toBeDefined()
  if (!createdPlace.data) {
    throw new Error('Failed to create place')
  }

  const result = await QueryPlace({
    event: undefined,
    placeId: createdPlace.data.PlaceID,
    client: testDb as any,
  })
  if (!result.success || !result.data) {
    throw new Error('Failed to query place')
  }

  expect(result).toBeDefined()
  expect(result.success).toBe(true)
  expect(result.data.Name).toBe(placeData.name)
})

test('Query all places', async () => {
  // First create a user and a place so we have data to query
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })

  // Create a place
  await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData: {
      name: faker.company.name(),
      address: faker.location.streetAddress(),
      description: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }).toString(),
      coordinates: [
        faker.number.float({ min: -90, max: 90 }),
        faker.number.float({ min: -180, max: 180 }),
      ] as [number, number],
    },
    client: testDb as any,
  })

  const result = await QueryPlaces({
    event: undefined,
    client: testDb as any,
  })

  expect(result).toBeDefined()
  expect(result.success).toBe(true)
  expect(result.data).toBeDefined()
  expect(Array.isArray(result.data)).toBe(true)
  if (result.data) {
    expect(result.data.length).toBeGreaterThan(0)
  }
})

test('Update a place', async () => {
  // First create a user
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  }

  const createdPlace = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: testDb as any,
  })

  const updateData = {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
  }
  if (!createdPlace.data) {
    throw new Error('Failed to create place')
  }

  const result = await UpdatePlace({
    event: undefined,
    placeId: createdPlace.data.PlaceID,
    placeData: updateData,
    client: testDb as any,
  })
  if (!result.success || !result.data) {
    throw new Error('Failed to update place')
  }
  expect(result).toBeDefined()
  expect(result.success).toBe(true)
  expect(result.data.Name).toBe(updateData.name)
})

test('Delete a place', async () => {
  // First create a user
  await CreateUser({
    event: undefined,
    session: {
      name: 'test',
      user: {
        name: 'Kampouse',
        email: 'jpmartel98@gmail.com',
        image: 'somthing',
      },
    },
    client: testDb as any,
  })

  const user = await GetUserFromEmail({
    event: undefined,
    email: 'jpmartel98@gmail.com',
    client: testDb as any,
  })

  const placeData = {
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    description: faker.lorem.paragraph(),
    rating: faker.number.int({ min: 1, max: 5 }).toString(),
    coordinates: [
      faker.number.float({ min: -90, max: 90 }),
      faker.number.float({ min: -180, max: 180 }),
    ] as [number, number],
  }

  const createdPlace = await CreatePlace({
    event: undefined,
    userID: user?.ID as number,
    placeData,
    client: testDb as any,
  })
  if (!createdPlace.data) {
    throw new Error('Failed to create place')
  }

  const result = await DeletePlace({
    event: undefined,
    placeId: createdPlace.data.PlaceID,
    client: testDb as any,
  })

  expect(result).toBeDefined()
  expect(result.success).toBe(true)
})
