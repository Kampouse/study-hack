import { component$, useSignal } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city'

import { getEvents } from '~/api/EndPoint'
import { DetailedEventCard } from '../home/detailed-event-card'

export type Events = Awaited<ReturnType<typeof useEvents>>

export const head = {
  title: 'S&H | Events',
}

export const useEvents = routeLoader$(async event => {
  const data = await getEvents({
    event: event,
    options: {
      limit: 1000, // Consider pagination or smaller limits for performance
    },
  })
  return data
})

// Define how many items to show initially and how many to load more
const INITIAL_EVENTS_COUNT = 5
const EVENTS_INCREMENT = 5

export default component$(() => {
  const events = useEvents()
  const visibleEventsCount = useSignal(INITIAL_EVENTS_COUNT)
  const searchTermSignal = useSignal('') // Default search is empty
  const dateRangeSignal = useSignal('all') // Default to show all dates
  const sortOption = useSignal('date-asc') // Default sort by date

  // Transform the API data for our event cards
  const eventsDataForCards =
    events.value.data?.map(event => ({
      id: event.eventID,
      title: event.name,
      image: event.image || '/placeholder.svg',
      badge: 'Event', // Or derive from event type/tags
      type: 'Study Group', // Or derive from event type
      date: event.date.split(' ')[0],
      time: event.starttime.split(':')[0] + ':' + event.starttime.split(':')[1],
      location: event.location || 'Location TBD',
      creator: event.creator || 'Anonymous',
      attendees: event.attendees ?? 8, // Fetch real attendee count if available
      spotsLeft: 5, // Fetch real spots left if available
    })) || []

  // Filter events based on search term and date range
  const filteredEvents = eventsDataForCards.filter(event => {
    // Simple case-insensitive search
    const searchMatch =
      searchTermSignal.value === '' ||
      event.title
        .toLowerCase()
        .includes(searchTermSignal.value.toLowerCase()) ||
      event.location
        .toLowerCase()
        .includes(searchTermSignal.value.toLowerCase())

    // Date filtering would go here
    // For now we're just passing everything through

    return searchMatch
  })

  // Sort events based on selected option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortOption.value === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    } else if (sortOption.value === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortOption.value === 'popular') {
      return b.attendees - a.attendees
    }
    return 0
  })

  const allEventsLoaded = visibleEventsCount.value >= sortedEvents.length

  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      {/* Hero Section */}
      <section class="relative bg-gradient-to-b from-[#F8EDE3] to-[#FFF8F0] pt-8">
        <div class="container px-4 md:px-6">
          <div class="my-8 flex flex-col items-start justify-between md:flex-row md:items-center"></div>
        </div>
      </section>

      {/* Main Content */}
      <section class="px-4 py-8 md:px-6">
        <div class="container mx-auto">
          {/* Search and Filters */}
          <div class="mb-8 flex flex-col gap-4 sm:flex-row">
            <div class="relative flex-grow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D98E73]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="search"
                type="text"
                bind:value={searchTermSignal}
                placeholder="Search events, locations, or descriptions..."
                class="h-9 w-full rounded-md border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-[#5B3E29] placeholder-[#A99D8F] focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
              />
            </div>
            <div>
              <select
                id="date-range"
                bind:value={dateRangeSignal}
                class="h-9 w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-[#5B3E29] focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
              >
                <option value="all">All Dates</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
            <div>
              <select
                bind:value={sortOption}
                class="h-9 w-full rounded-md border border-[#E6D7C3] bg-white px-3 py-2 text-[#5B3E29] focus:border-[#D98E73] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
              >
                <option value="date-asc">Date: Soonest First</option>
                <option value="date-desc">Date: Latest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Events Listing */}
          <div class="space-y-6">
            {sortedEvents.length > 0 ? (
              <>
                {sortedEvents.slice(0, visibleEventsCount.value).map(event => (
                  <DetailedEventCard key={event.id} event={event} />
                ))}

                {/* Load more button */}
                {!allEventsLoaded && (
                  <div class="mt-8 text-center">
                    <button
                      type="button"
                      onClick$={() => {
                        visibleEventsCount.value += EVENTS_INCREMENT
                      }}
                      class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-8 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                      Load More Events
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div class="rounded-xl border border-[#E6D7C3] bg-white p-8 text-center">
                <h3 class="mb-2 text-xl font-semibold text-[#5B3E29]">
                  No events found
                </h3>
                <p class="mb-6 text-[#6D5D4E]">
                  Try adjusting your search filters or create your own event!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section class="mt-8 bg-[#F8EDE3] py-12">
        <div class="container px-4 md:px-6">
          <div class="rounded-2xl bg-white p-8 shadow-md">
            <div class="flex flex-col items-center gap-8 md:flex-row">
              <div class="md:w-1/3">
                <div class="overflow-hidden rounded-xl bg-[#F8D7BD] p-6 text-center">
                  <div class="flex h-40 items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D98E73"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="md:w-2/3">
                <h2 class="mb-3 text-2xl font-bold text-[#5B3E29]">
                  Host Your Own Study Session
                </h2>
                <p class="mb-6 text-[#6D5D4E]">
                  Have a project you're working on? Want to find study partners?
                  Create your own event and connect with others who share your
                  interests and goals.
                </p>
                <div class="flex flex-wrap gap-4">
                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-md bg-[#D98E73] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-[#C27B62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Create an Event
                  </button>
                  <button
                    type="button"
                    class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-4 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Browse Popular Locations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
})
