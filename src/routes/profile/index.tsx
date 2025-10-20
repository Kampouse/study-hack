import { component$, useComputed$, useStore, useTask$ } from '@builder.io/qwik'

// --- Routing & Data Fetching ---
import { routeLoader$ } from '@builder.io/qwik-city'
import { getAllReferenceEvents } from '~/api/EndPoint' // Assuming API endpoint functions exist
// --- Layout & API Imports ---
import { useQueries } from './layout' // Assuming layout defines useQueries returning QueriesDataType
// --- Type Definitions ---
import type {
  DetailedEventType,
  RawEventType,
  // RawUserDataType, // Keep if needed elsewhere, otherwise remove if unused
  UserProfileType,
} from './types'

// 3/31/2025 at 8:00 AM
//
//

const formatEventDate = (dateString: string) => {
  try {
    // Parse the date string "3/31/2025 at 8:00 AM" format
    const dateTimeParts = dateString.split(' at ')
    const datePart = dateTimeParts[0]
    const timePart = dateTimeParts[1]

    // Create a valid date object from the date part
    const dateObj = new Date(datePart)

    // Set the time part if available
    if (timePart) {
      const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (timeMatch) {
        const hour = Number.parseInt(timeMatch[1], 10)
        const minute = Number.parseInt(timeMatch[2], 10)
        const ampm = timeMatch[3].toUpperCase()

        // Convert to 24-hour format
        let hours24 = hour
        if (ampm === 'PM' && hour < 12) hours24 += 12
        if (ampm === 'AM' && hour === 12) hours24 = 0

        // Round minutes to nearest 15
        const roundedMinutes = Math.ceil(minute / 15) * 15
        let adjustedHour = hours24

        // Handle case where minutes round to 60
        if (roundedMinutes === 60) {
          adjustedHour = (hours24 + 1) % 24
        }

        // Set hours and minutes on the date object
        dateObj.setHours(adjustedHour)
        dateObj.setMinutes(roundedMinutes === 60 ? 0 : roundedMinutes)
        dateObj.setSeconds(0)
        dateObj.setMilliseconds(0)
      }
    }

    // Generate display strings
    const displayDate = dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    const displayTime = dateObj.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    // Return both the formatted date object for comparison and display strings
    return {
      date: dateObj,
      displayDate,
      displayTime,
    }
  } catch (e) {
    console.error('Error parsing date:', e)
    return {
      date: new Date(), // Return current date as fallback
      displayDate: '',
      displayTime: '',
    }
  }
}

import { ActiveRequestsSidebar } from '@/components/profile/ActiveRequestsSidebar'
import { CreateEventCTA } from '@/components/profile/CreateEventCTA'
// --- UI Components ---
import { TabsSection } from '@/components/profile/TabsSection'

// --- Qwik Actions & Loaders ---

export const useGetAllReferenceEvents = routeLoader$(
  async (event): Promise<RawEventType[]> => {
    try {
      // Assume getAllReferenceEvents returns RawEventType[] or something castable
      const events: unknown = await getAllReferenceEvents(event)
      // Add runtime validation
      if (!Array.isArray(events)) {
        console.warn('getAllReferenceEvents did not return an array:', events)
        return []
      }
      // TODO: Add more robust validation here if needed (e.g., using zod)
      // For now, we cast, assuming the API is somewhat reliable
      return events as RawEventType[]
    } catch (error) {
      console.error('Error fetching reference events:', error)
      return [] // Return empty array on error
    }
  }
)

export default component$(() => {
  // --- Backend Data Hooks ---
  const data = useQueries() // From layout: { userData, activeRequest, ... }
  const eventsResource = useGetAllReferenceEvents() // Fetched reference events

  // --- State Signals and Stores ---
  const profileStore = useStore({
    name: '',
    username: '', // Needs to be populated if username is distinct from description
    bio: '',
    skills: [] as string[],
    avatar: '', // To potentially handle avatar updates
    stats: {
      placeCreated: 0,
      eventCreated: 0,
      eventAttended: 0,
    },
  })
  // --- Effects ---
  // Task to initialize the profile edit store when userData is available
  useTask$(({ track }) => {
    track(() => data.value.userData) // Rerun when userData changes

    const user = data.value.userData
    if (user) {
      profileStore.name = user.Name
      // Assuming Username might exist, otherwise fallback to something else or leave blank
      profileStore.username = user.Username // Fallback using Description if no Username
      profileStore.bio = user.Description ?? '' // Using Description for Bio
      // Backend seems to use 'Intrests' (typo?) - handle potential string or array format
      profileStore.skills = Array.isArray(user.Intrests) ? user.Intrests : []
      profileStore.avatar = user.Image ?? ''
      // Handle the stats object mapping correctly
      // Check if userStats exists before accessing its properties

      // Map from API response to expected profileStore structure
      profileStore.stats = {
        placeCreated: data.value.userStats.data?.placesCreated || 0,
        eventCreated: data.value.userStats.data?.eventsCreated || 0,
        eventAttended: data.value.userStats.data?.eventsAttended || 0,
      }
    }
  })

  // --- Derived Data ---
  const allEvents = useComputed$(() => {
    const rawEvents = eventsResource.value

    const userId = data.value.userData?.ID
    // Add robust date parsing and type checking/casting
    return rawEvents
      .map(
        (event): DetailedEventType => ({
          // Ensure the mapped object matches DetailedEventType
          // Map to DetailedEventType structure for consistency
          ...event, // Spread existing RawEvent properties
          id: event.eventID ?? Math.random(), // Ensure some unique string ID (UUID preferred)
          eventID: event.eventID,
          name: event.name,
          date: event.date, // Ensure date is valid ISO string
          attendees:
            typeof event.attendees === 'number' ? event.attendees : null, // Ensure number or null
          description: event.description ?? null,
          image: event.image ?? null,
          location: event.location ?? null,
          role:
            event.role ??
            (userId !== undefined && event.userID === userId
              ? 'Host'
              : 'Attendee'), // Infer role if possible
        })
      )
      .sort((a, b) => {
        try {
          const dateA = new Date(a.date)
          const dateB = new Date(b.date)
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0 // Don't sort invalid dates relative to others
          return dateA.getTime() - dateB.getTime()
        } catch (e) {
          console.error('Invalid date found during sorting:', a.date, b.date)
          return 0 // Handle invalid dates
        }
      })
  })

  const hostedEvents = useComputed$(() =>
    allEvents.value.filter(event => event.role === 'host')
  )
  const currentDate = new Date()
  // Filter for upcoming events (future date)
  const upcomingEvents = useComputed$(() =>
    allEvents.value.filter(event => {
      try {
        const eventDate = formatEventDate(event.date).date
        return (
          !isNaN(formatEventDate(event.date).date.getTime()) &&
          eventDate > currentDate &&
          event.role !== 'Host'
        )
      } catch (e) {
        return false // Invalid dates are not upcoming
      }
    })
  )

  // Filter for past events (date has passed)
  const pastEvents = useComputed$(() =>
    allEvents.value.filter(event => {
      try {
        const eventDate = formatEventDate(event.date).date
        return (
          !isNaN(eventDate.getTime()) &&
          eventDate < currentDate &&
          event.role !== 'Host'
        )
      } catch (e) {
        return false // Invalid dates are not past
      }
    })
  )

  // Saved places from the routeLoader
  const savedPlaces = useComputed$(() => {
    // Access userPlaces from the data value if available
    // Map from backend format to PlaceType expected by components
    return (data.value.userPlaces.data || []).map(place => ({
      id: place.PlaceID,
      placeId: place.PlaceID,
      name: place.Name,
      location: place.Address,
      description: place.Description,
      image: place.ImageURL || undefined,
      tags: place.Tags || [],
      rating: typeof place.Rating === 'number' ? place.Rating : 0,
      coordinates: place.Coordinates,
      visitCount: 0, // Default if not provided
      category: place.Category || '',
    }))
  })
  // Liked places - similar structure to saved places but different source
  const likedPlaces = useComputed$(() => {
    // In a real implementation, this would pull from the API
    return []
  })

  const userProfile = useComputed$(
    (): UserProfileType => ({
      name: profileStore.name || 'Loading...',
      username: profileStore.username || '...',
      bio: profileStore.bio || 'No bio yet.',
      avatar: profileStore.avatar || undefined,
      skills: profileStore.skills,
      stats: profileStore.stats,
      joinedDate: (() => {
        // Assuming JoinedDate exists on userData - Cast if necessary
        const joinedDateStr = (data.value.userData as any)?.JoinedDate
        if (!joinedDateStr) return 'Recently'
        try {
          return new Date(joinedDateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
          })
        } catch {
          return 'Recently' // Fallback for invalid date
        }
      })(),
      // Ensure all required UserProfileType fields are present
    })
  )

  return (
    // Keep the main background color, the warmth is part of the theme
    <div class="min-h-screen bg-[#FFF8F0] pb-16 pt-10 md:pb-20">
      <div class=" px-4 md:px-6">
        <div class="lg:col-span-1">
          {/* Use resolved values from signals/stores */}
          <TabsSection
            profile={userProfile.value}
            upcomingEvents={upcomingEvents.value}
            hostedEvents={hostedEvents.value}
            pastEvents={pastEvents.value}
            savedPlaces={savedPlaces.value}
            likedPlaces={likedPlaces.value}
            requests={data.value.activeRequest || []}
          />

          {data.value.activeRequest && data.value.activeRequest.length > 0 && (
            <div class="mt-8 lg:mt-0 lg:pl-8">
              {' '}
              {/* Add margin top for spacing */}
              <ActiveRequestsSidebar requests={data.value.activeRequest} />
            </div>
          )}
        </div>
      </div>
      <CreateEventCTA />
    </div>
  )
})
