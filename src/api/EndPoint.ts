import {
  GetUser,
  QueryAllReferenceEvents,
  QueryConfirmedUsers,
  QueryEvent,
  type QueryEventOptions,
  QueryEvents,
  QueryPlaces,
  QueryUserPlaces,
  QueryUserStats,
} from '~/api/Query'
import type { Requested } from '~/api/drizzled'
import { ErrorMessages, getContextualError } from '~/utils/errorMessages'
import { QueryPlace } from './Query'
import type { GetUserReturnType } from './Query'

export const getEvents = async ({
  event,
  options,
}: {
  event: Requested
  options: QueryEventOptions
}) => {
  try {
    const user = await GetUser({ event })
    if (user === null) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.USER_NOT_AUTHENTICATED,
      }
    }

    const data = await QueryEvents({
      event,
      options: { ...options, byUser: user.ID, active: true },
    })
    if (data === null) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.EVENT_LOAD_FAILED,
      }
    }
    return {
      success: true,
      data: data?.map(item => {
        return {
          ...item,
          date: (() => {
            const date = new Date(item.date)
            const hrs = item.starttime ? item.starttime.split(':')[0] : '00'
            const minutes = item.starttime ? item.starttime.split(':')[1] : '00'
            const ampm = Number.parseInt(hrs) >= 12 ? 'PM' : 'AM'
            const formattedHours = Number.parseInt(hrs) % 12 || 12
            return `${date.toLocaleDateString()} at ${formattedHours}:${minutes} ${ampm}`
          })(),
          starttime: item.starttime.slice(0, 5), // Only take HH:MM
          host: item.userID == user.ID,
        }
      }),
    }
  } catch (e) {
    console.error('Error fetching events:', e)
    return {
      success: false,
      data: null,
      error: getContextualError('fetch', 'event', e),
    }
  }
}

export const getEvent = async (event: Requested, id: string) => {
  try {
    const data = await QueryEvent({
      event,
      id: Number.parseInt(id),
      options: {},
    })

    return { success: true, data: data }
  } catch (e) {
    console.error('Error fetching event:', e)
    return { success: false, data: null, error: ErrorMessages.EVENT_NOT_FOUND }
  }
}

export const getFirstEvent = async (
  event: Requested,
  options: QueryEventOptions
) => {
  const response = await getEvents({ event, options })

  if (response.success && response.data !== null) {
    return response
  }
  return null
}
type baseEvent = ReturnType<Awaited<typeof getFirstEvent>>
export type Events = baseEvent extends Promise<infer T> ? T : never

export const getAllReferenceEvents = async (event: Requested) => {
  const user = await GetUser({ event })

  const data = await QueryAllReferenceEvents({
    event: event,
    UserID: user?.ID as number,
    options: {
      limit: 8,
    },
  })

  return data
}
export const getPlace = async ({
  event,
  id,
  placeName,
}: {
  event: Requested
  id?: number | undefined
  placeName?: string | undefined
}) => {
  try {
    const data = await QueryPlace({
      event,
      placeId: id,
      name: placeName,
    })
    if (!data.success || !data.data) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.PLACE_NOT_FOUND,
      }
    }
    return { success: true, data: data.data }
  } catch (e) {
    console.error('Error fetching place:', e)
    return {
      success: false,
      data: null,
      error: getContextualError('fetch', 'place', e),
    }
  }
}

export const getPlaces = async (
  event: Requested,
  params: { limit?: number; offset?: number; exclude?: number[] }
) => {
  try {
    const data = await QueryPlaces({
      event: event as Requested,
      params: {
        limit: params.limit,
        offset: params.offset,
        exclude: params.exclude,
      },
    })
    if (!data.success || !data.data) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.PLACE_LOAD_FAILED,
      }
    }
    return { success: true, data: data.data }
  } catch (e) {
    console.error('Error fetching places:', e)
    return {
      success: false,
      data: null,
      error: getContextualError('fetch', 'place', e),
    }
  }
}
export const getUserStats = async (
  event: Requested,
  user: GetUserReturnType
) => {
  try {
    const data = await QueryUserStats({
      event: event as Requested,
      user: user,
    })
    if (!data.success || !data.data) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.USER_STATS_FAILED,
      }
    }
    return { success: true, data: data.data }
  } catch (e) {
    console.error('Error fetching user stats:', e)
    return {
      success: false,
      data: null,
      error: ErrorMessages.USER_STATS_FAILED,
    }
  }
}

export const getUserPlaces = async (
  event: Requested,
  user: GetUserReturnType,
  params?: { limit?: number; offset?: number }
) => {
  try {
    const data = await QueryUserPlaces({
      event: event as Requested,
      user: user,
      params: params,
    })
    if (!data.success || !data.data) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.USER_PLACES_FAILED,
      }
    }
    return { success: true, data: data.data }
  } catch (e) {
    console.error('Error fetching user places:', e)
    return {
      success: false,
      data: null,
      error: ErrorMessages.USER_PLACES_FAILED,
    }
  }
}

export const getConfirmedUsers = async (event: Requested, eventId: number) => {
  try {
    const data = await QueryConfirmedUsers({
      event: event,
      eventId: eventId,
    })
    if (!data.success || !data.data) {
      return {
        success: false,
        data: null,
        error: ErrorMessages.CONFIRMED_USERS_FAILED,
      }
    }
    return { success: true, data: data.data }
  } catch (e) {
    console.error('Error fetching confirmed users:', e)
    return {
      success: false,
      data: null,
      error: ErrorMessages.CONFIRMED_USERS_FAILED,
    }
  }
}
