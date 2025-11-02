import { $, component$, useSignal, useTask$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { ArrowRightIcon as ArrowRight } from 'lucide-qwik'
import { CreateEventCard } from './create-event-card'
import { DetailedEventCard } from './detailed-event-card'
import { EventCard } from './event-card'
import { LargeCreateEventCard } from './large-create-event-card'
import { PlaceCard } from './place-card'
import { SharePlaceCard } from './share-place-card'

import { useLocation } from '@builder.io/qwik-city'

interface TabsSectionProps {
  placesApiData: any[]
  eventsData: any[]
}

// Define how many items to show initially and how many to load more
const INITIAL_PLACES_COUNT = 7 // Show 7 places + 1 share card = 8 items (fits 4-col grid)
const PLACES_INCREMENT = 8
const INITIAL_EVENTS_COUNT = 4 // Show 4 events initially
const EVENTS_INCREMENT = 4

export const TabsSection = component$((props: TabsSectionProps) => {
  const loc = useLocation()

  // Get the active tab from URL or default to "all"
  const activeTab = useSignal(loc.url.searchParams.get('tab') ?? 'all')

  // Keep tab state in sync with URL parameter
  useTask$(({ track }) => {
    const tab = track(() => loc.url.searchParams.get('tab'))
    activeTab.value = tab ?? 'all'
  })

  const visiblePlacesCount = useSignal(INITIAL_PLACES_COUNT)
  const visibleEventsCount = useSignal(INITIAL_EVENTS_COUNT)

  // Filter state variables with proper TypeScript types
  const searchTerm = useSignal<string>('')
  const placeFilterCategory = useSignal<string>('all')
  const eventFilterDateRange = useSignal<string>('all')
  const eventSort = useSignal<string>('date-asc')
  const placeSort = useSignal<string>('recommended')
  const activeQuickFilters = useSignal<string[]>([])

  // Filter functions
  const filterPlaces = (places: any[]) => {
    return places.filter(place => {
      const matchesSearch =
        searchTerm.value === '' ||
        place.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        place.description
          ?.toLowerCase()
          .includes(searchTerm.value.toLowerCase()) ||
        place.location?.toLowerCase().includes(searchTerm.value.toLowerCase())

      const matchesCategory =
        placeFilterCategory.value === 'all' ||
        (placeFilterCategory.value === 'popular' &&
          place.badge === 'Popular') ||
        (placeFilterCategory.value === 'coffee' &&
          place.tags?.includes('Coffee')) ||
        (placeFilterCategory.value === 'quiet' &&
          place.tags?.includes('Quiet')) ||
        (placeFilterCategory.value === 'wifi' &&
          place.tags?.includes('WiFi')) ||
        (placeFilterCategory.value === 'power' && place.tags?.includes('Power'))

      const matchesQuickFilters =
        activeQuickFilters.value.length === 0 ||
        activeQuickFilters.value.every(filter => place.tags?.includes(filter))

      return matchesSearch && matchesCategory && matchesQuickFilters
    })
  }

  const filterEvents = (events: any[]) => {
    return events.filter(event => {
      const matchesSearch =
        searchTerm.value === '' ||
        event.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        event.description
          ?.toLowerCase()
          .includes(searchTerm.value.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.value.toLowerCase())

      const now = new Date()
      const eventDate = new Date(event.date)
      let matchesDateRange = true

      if (eventFilterDateRange.value === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        matchesDateRange = eventDate >= today && eventDate < tomorrow
      } else if (eventFilterDateRange.value === 'this_week') {
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        matchesDateRange = eventDate >= now && eventDate <= weekFromNow
      } else if (eventFilterDateRange.value === 'next_week') {
        const nextWeekStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        const nextWeekEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
        matchesDateRange =
          eventDate >= nextWeekStart && eventDate <= nextWeekEnd
      }

      return matchesSearch && matchesDateRange
    })
  }

  const sortPlaces = (places: any[]) => {
    const sorted = [...places]
    if (placeSort.value === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (placeSort.value === 'newest') {
      // Sort by visitCount as a proxy for popularity/recency
      // Higher visit count suggests more recently visited or popular places
      sorted.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0))
    }
    return sorted
  }

  const sortEvents = (events: any[]) => {
    const sorted = [...events]
    if (eventSort.value === 'date-asc') {
      sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    } else if (eventSort.value === 'date-desc') {
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } else if (eventSort.value === 'popular') {
      sorted.sort(
        (a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0)
      )
    }
    return sorted
  }

  const clearAllFilters = $(() => {
    searchTerm.value = ''
    placeFilterCategory.value = 'all'
    eventFilterDateRange.value = 'all'
    eventSort.value = 'date-asc'
    placeSort.value = 'recommended'
    activeQuickFilters.value = []
  })

  const toggleQuickFilter = $((filter: string) => {
    const current = activeQuickFilters.value
    if (current.includes(filter)) {
      activeQuickFilters.value = current.filter(f => f !== filter)
    } else {
      activeQuickFilters.value = [...current, filter]
    }
  })

  const allPlacesLoaded = visiblePlacesCount.value >= props.placesApiData.length
  const allEventsLoaded = visibleEventsCount.value >= props.eventsData.length

  return (
    <section class="px-4 py-8 pt-0 md:px-6">
      <div class="w-full">
        {/* Tab Triggers */}
        <div class="relative mb-8 grid grid-cols-3 rounded-lg bg-[#F8EDE3] p-1">
          <Link
            href="/home?tab=all"
            scroll={false}
            class={`rounded-lg px-6 py-2 text-center text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === 'all'
                ? 'bg-white text-[#5B3E29] shadow-sm'
                : 'hover:bg-[#F1DFC6]/50'
            }`}
          >
            All
          </Link>
          <Link
            scroll={false}
            href="/home?tab=events"
            class={`inline-block rounded-lg px-6 py-2 text-center text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === 'events'
                ? 'bg-white text-[#5B3E29] shadow-sm'
                : 'hover:bg-[#F1DFC6]/50'
            }`}
          >
            Events
          </Link>
          <Link
            scroll={false}
            href="/home?tab=places"
            class={`rounded-lg px-6 py-2 text-center text-[#6D5D4E] transition-all duration-300 ease-in-out ${
              activeTab.value === 'places'
                ? 'bg-white text-[#5B3E29] shadow-sm'
                : 'hover:bg-[#F1DFC6]/50'
            }`}
          >
            Places
          </Link>
        </div>

        {/* All Content Tab */}
        {activeTab.value === 'all' && (
          <div class="mt-8 space-y-12">
            {/* Featured Places Section */}
            <div>
              <div class="mb-4">
                <h2 class="text-2xl font-bold text-[#5B3E29]">Cozy Places</h2>
              </div>
              <div class="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Show first 3 places */}
                {props.placesApiData.slice(0, 3).map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
              <div class="text-center">
                <Link
                  href="/places"
                  class="inline-flex items-center text-[#D98E73] hover:underline"
                >
                  View all places <ArrowRight class="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div>
              <div class="mb-4">
                <h2 class="text-2xl font-bold text-[#5B3E29]">
                  Upcoming Events
                </h2>
              </div>
              <div class="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Show first 3 events + add CreateEventCard if needed */}
                {props.eventsData.slice(0, 3).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
                {props.eventsData.length < 3 && <CreateEventCard />}
              </div>
              <div class="text-center">
                <Link
                  href="/events"
                  class="inline-flex items-center text-[#D98E73] hover:underline"
                >
                  View all events <ArrowRight class="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab.value === 'places' && (
          <div class="mt-8">
            {/* Search and Filter Bar */}
            <div class="mb-6 space-y-4">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="relative max-w-md flex-1">
                  <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Search cozy spaces..."
                    class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  />
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      class="h-4 w-4 text-[#A99D8F]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <select
                    bind:value={placeFilterCategory}
                    class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  >
                    <option value="all">
                      {'All Categories (' + props.placesApiData.length + ')'}
                    </option>
                    {(() => {
                      const popularCount = props.placesApiData.filter(p =>
                        p.tags?.includes('Popular')
                      ).length
                      return (
                        <option value="popular">
                          {`Popular${
                            popularCount > 0 ? ` (${popularCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                    {(() => {
                      const coffeeCount = props.placesApiData.filter(p =>
                        p.tags?.includes('Coffee')
                      ).length
                      return (
                        <option value="coffee">
                          {`Coffee Shops${
                            coffeeCount > 0 ? ` (${coffeeCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                    {(() => {
                      const quietCount = props.placesApiData.filter(p =>
                        p.tags?.includes('Quiet')
                      ).length
                      return (
                        <option value="quiet">
                          {`Quiet Spaces${
                            quietCount > 0 ? ` (${quietCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                    {(() => {
                      const wifiCount = props.placesApiData.filter(p =>
                        p.tags?.includes('WiFi')
                      ).length
                      return (
                        <option value="wifi">
                          {`WiFi Available${
                            wifiCount > 0 ? ` (${wifiCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                    {(() => {
                      const powerCount = props.placesApiData.filter(p =>
                        p.tags?.includes('Power')
                      ).length
                      return (
                        <option value="power">
                          {`Power Outlets${
                            powerCount > 0 ? ` (${powerCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                  </select>
                  <select
                    bind:value={placeSort}
                    class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Most Visited</option>
                  </select>
                  {(searchTerm.value !== '' ||
                    placeFilterCategory.value !== 'all' ||
                    placeSort.value !== 'recommended' ||
                    activeQuickFilters.value.length > 0) && (
                    <button
                      type="button"
                      onClick$={clearAllFilters}
                      class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div class="flex flex-wrap gap-2">
                {['Coffee', 'WiFi', 'Quiet', 'Power', 'Music', 'Study'].map(
                  tag => (
                    <button
                      key={tag}
                      onClick$={() => toggleQuickFilter(tag)}
                      class={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        activeQuickFilters.value.includes(tag)
                          ? 'bg-[#D98E73] text-white'
                          : 'bg-[#F8EDE3] text-[#6D5D4E] hover:bg-[#E6D7C3]'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* Filter and sort places */}
              {sortPlaces(filterPlaces(props.placesApiData))
                .slice(0, visiblePlacesCount.value)
                .map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              {/* Always show SharePlaceCard if not all places loaded or if it fits */}
              {(visiblePlacesCount.value < props.placesApiData.length ||
                props.placesApiData.length === 0 ||
                props.placesApiData.length % 4 !== 0) && <SharePlaceCard />}
            </div>
            {/* Show Load More button only if there are more places to load */}
            {!allPlacesLoaded && (
              <div class="mt-10 text-center">
                <button
                  type="button"
                  onClick$={() => {
                    visiblePlacesCount.value += PLACES_INCREMENT
                  }}
                  class="inline-flex h-10 items-center justify-center rounded-md border border-[#D98E73] bg-transparent px-8 py-2 text-sm font-medium text-[#D98E73] ring-offset-background transition-colors hover:bg-[#FFF1E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Load More Spaces
                </button>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab.value === 'events' && (
          <div class="mt-8">
            {/* Search and Filter Bar */}
            <div class="mb-6 space-y-4">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div class="relative max-w-md flex-1">
                  <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Search upcoming events..."
                    class="w-full rounded-lg border border-[#E6D7C3] bg-white py-2 pl-10 pr-4 text-sm text-[#5B3E29] placeholder-[#A99D8F] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  />
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      class="h-4 w-4 text-[#A99D8F]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <select
                    bind:value={eventFilterDateRange}
                    class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  >
                    <option value="all">
                      {'All Upcoming (' + props.eventsData.length + ')'}
                    </option>
                    {(() => {
                      const todayCount = props.eventsData.filter(e => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        const tomorrow = new Date(today)
                        tomorrow.setDate(tomorrow.getDate() + 1)
                        const eventDate = new Date(e.date)
                        return eventDate >= today && eventDate < tomorrow
                      }).length
                      return (
                        <option value="today">
                          {`Today${todayCount > 0 ? ` (${todayCount})` : ''}`}
                        </option>
                      )
                    })()}
                    {(() => {
                      const thisWeekCount = props.eventsData.filter(e => {
                        const now = new Date()
                        const weekFromNow = new Date(
                          now.getTime() + 7 * 24 * 60 * 60 * 1000
                        )
                        const eventDate = new Date(e.date)
                        return eventDate >= now && eventDate <= weekFromNow
                      }).length
                      return (
                        <option value="this_week">
                          {`This Week${
                            thisWeekCount > 0 ? ` (${thisWeekCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                    {(() => {
                      const nextWeekCount = props.eventsData.filter(e => {
                        const now = new Date()
                        const nextWeekStart = new Date(
                          now.getTime() + 7 * 24 * 60 * 60 * 1000
                        )
                        const nextWeekEnd = new Date(
                          now.getTime() + 14 * 24 * 60 * 60 * 1000
                        )
                        const eventDate = new Date(e.date)
                        return (
                          eventDate >= nextWeekStart && eventDate <= nextWeekEnd
                        )
                      }).length
                      return (
                        <option value="next_week">
                          {`Next Week${
                            nextWeekCount > 0 ? ` (${nextWeekCount})` : ''
                          }`}
                        </option>
                      )
                    })()}
                  </select>
                  <select
                    bind:value={eventSort}
                    class="rounded-lg border border-[#E6D7C3] bg-white px-3 py-2 text-sm text-[#6D5D4E] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                  >
                    <option value="date-asc">Date: Soonest</option>
                    <option value="date-desc">Date: Latest</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  {(searchTerm.value !== '' ||
                    eventFilterDateRange.value !== 'all' ||
                    eventSort.value !== 'date-asc') && (
                    <button
                      type="button"
                      onClick$={clearAllFilters}
                      class="rounded-lg border border-[#D98E73] bg-transparent px-3 py-2 text-sm text-[#D98E73] hover:bg-[#FFF1E6] focus:outline-none focus:ring-2 focus:ring-[#D98E73]/20"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div class="space-y-6">
              {/* Filter and sort events */}
              {sortEvents(filterEvents(props.eventsData))
                .slice(0, visibleEventsCount.value)
                .map(event => (
                  <DetailedEventCard key={event.id} event={event} />
                ))}
              <LargeCreateEventCard />
              {/* Show Load More button only if there are more events to load */}
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
            </div>
          </div>
        )}
      </div>
    </section>
  )
})
