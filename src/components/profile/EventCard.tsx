import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import {
  CalendarIcon as Calendar,
  CheckCircleIcon as CheckCircle,
  Clock3Icon as Clock3,
  InfoIcon,
  MapPinIcon as MapPin,
  UserPlusIcon as UserPlus,
  UsersIcon as Users,
  XCircleIcon as XCircle,
} from 'lucide-qwik'
import type { DetailedEventType } from '~/routes/profile/types'
import JustRnD from '../../assets/just-rnd.png?url'

interface EventCardProps {
  event: DetailedEventType
  isHosted?: boolean
}

const isEventInPast = (dateString: string, timeString?: string) => {
  if (!dateString) return false

  try {
    const eventDate = new Date(dateString)

    // Add time information if timeString is provided
    if (timeString) {
      const [hours, minutes] = timeString
        .split(':')
        .map(part => Number.parseInt(part, 10))
      if (!isNaN(hours) && !isNaN(minutes)) {
        eventDate.setHours(hours, minutes)
      }
    }

    const now = new Date()
    return eventDate < now
  } catch (error) {
    console.error('Error checking if event is in past:', error)
    return false
  }
}
const formatEventDate = (dateString: string) => {
  try {
    // Parse the date string "3/31/2025 at 8:00 AM" format
    const dateTimeParts = dateString.split(' at ')
    const datePart = dateTimeParts[0]
    const timePart = dateTimeParts[1]

    // Create a valid date object
    const dateObj = new Date(datePart)

    // Round time to nearest 15-minute interval (00, 15, 30, 45)
    let roundedTimePart = timePart
    if (timePart) {
      const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (timeMatch) {
        const hour = Number.parseInt(timeMatch[1], 10)
        const minute = Number.parseInt(timeMatch[2], 10)
        const ampm = timeMatch[3].toUpperCase()

        // Round minutes to nearest 15
        const roundedMinutes = Math.ceil(minute / 15) * 15
        let adjustedHour = hour
        let adjustedAmPm = ampm

        // Handle case where minutes round to 60
        if (roundedMinutes === 60) {
          adjustedHour = hour + 1
          // Handle noon/midnight transitions
          if (adjustedHour === 12 && ampm === 'AM') {
            adjustedAmPm = 'PM'
          } else if (adjustedHour === 12 && ampm === 'PM') {
            adjustedAmPm = 'AM'
          } else if (adjustedHour > 12) {
            adjustedHour = 1
          }
        }

        roundedTimePart = `${adjustedHour}:${roundedMinutes === 60 ? '00' : roundedMinutes.toString().padStart(2, '0')} ${adjustedAmPm}`
      }
    }

    // Format the date and time for display
    return {
      displayDate: dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      displayTime: roundedTimePart || '',
    }
  } catch (e) {
    console.error('Error parsing date:', e)
    return { displayDate: '', displayTime: '' }
  }
}

export const EventCard = component$<EventCardProps>(
  ({ event, isHosted = false }) => {
    const status = isHosted ? 'Host' : event.role || event.status || 'Pending'
    const isPast = isEventInPast(event.date, event.time)

    // Use the improved date formatting function
    const { displayDate, displayTime } = formatEventDate(event.date)

    // Status styles remain the same
    const statusStyles: Record<string, string> = {
      Host: 'bg-[#E6F2FF] text-[#5B8CB7]',
      Confirmed: 'bg-[#E8F4EA] text-[#6A9B7E]',
      Pending: 'bg-[#FFF1E6] text-[#D98E73]',
      'Past Event': 'bg-gray-100 text-gray-500',
      Default: 'bg-gray-100 text-gray-600',
    }

    // Use "Past Event" status for past events
    const finalStatus = isPast ? 'Past Event' : status
    const currentStatusStyle = statusStyles[finalStatus] || statusStyles.Default

    return (
      // Added h-full for flex/grid consistency, adjusted shadow and border slightly
      <Link
        href={`/details/${event.id}`}
        class="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-md transition-all duration-300 ease-in-out"
      >
        {/* Image Section */}
        <div class="relative aspect-[16/10] overflow-hidden">
          <img
            src={event.image || JustRnD}
            width={400} // Keep explicit dimensions for performance
            height={250}
            alt={`Image for ${event.name}`}
            class="h-full w-full object-cover transition-transform duration-500 "
            loading="lazy" // Added lazy loading
            onError$={e => {
              ;(e.target as HTMLImageElement).src = JustRnD
            }}
          />
          {/* Adjusted gradient for potentially better text visibility */}
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Location Badge - Adjusted padding, position, max-width */}
          {event.location && (
            <div class="absolute left-3 top-3 flex max-w-[calc(100%-6rem)] items-center rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#5B3E29] shadow-sm backdrop-blur-sm sm:left-4 sm:top-4">
              <MapPin class="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-[#D98E73]" />
              <span class="truncate">{event.location}</span>
            </div>
          )}

          {/* Status Badge - Adjusted padding */}
          <div class="absolute right-3 top-3 sm:right-4 sm:top-4">
            <span
              class={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${currentStatusStyle}`} // Adjusted padding slightly
            >
              {/* Increased icon margin */}
              {finalStatus === 'Host' && (
                <UserPlus class="mr-1.5 h-3.5 w-3.5" />
              )}
              {finalStatus === 'Confirmed' && (
                <CheckCircle class="mr-1.5 h-3.5 w-3.5" />
              )}
              {finalStatus === 'Pending' && (
                <Clock3 class="mr-1.5 h-3.5 w-3.5" />
              )}
              {finalStatus === 'Past Event' && (
                <XCircle class="mr-1.5 h-3.5 w-3.5" />
              )}
              {finalStatus !== 'Host' &&
                finalStatus !== 'Confirmed' &&
                finalStatus !== 'Pending' &&
                finalStatus !== 'Past Event' && (
                  <InfoIcon class="mr-1.5 h-3.5 w-3.5" />
                )}
              {finalStatus}
            </span>
          </div>

          {/* Text Overlay on Image - Adjusted padding, font sizes, layout */}
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-5">
            <h3 class="mb-2 line-clamp-2 text-lg font-semibold leading-tight transition-colors duration-300 group-hover:text-[#F8D7BD] sm:text-xl">
              {event.name}
            </h3>
            {/* Stack date/attendees vertically on small screens */}
            <div class="flex flex-col gap-1 text-xs opacity-95 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-sm">
              <div class="flex items-center gap-1.5">
                <Calendar class="h-4 w-4 flex-shrink-0" />{' '}
                {/* Prevent icon shrinking */}
                <span>
                  {displayDate} {displayTime ? `- ${displayTime}` : ''}
                </span>
              </div>
              {typeof event.attendees === 'number' && event.attendees > 0 && (
                <div class="flex items-center gap-1">
                  <Users class="h-4 w-4 flex-shrink-0" />{' '}
                  {/* Prevent icon shrinking */}
                  {/* Added context "Attendees" */}
                  <span>
                    {event.attendees} Attendee{event.attendees !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Adjusted padding, text size, line height, spacing */}
        <div class="flex flex-1 flex-col bg-white p-4 sm:p-5 md:p-6">
          {' '}
          {/* Added subtle background for content area */}
          <p class="mb-5 line-clamp-3 flex-grow rounded-lg border-stone-200/25 bg-stone-200/10 px-2 text-sm leading-relaxed text-gray-600 sm:line-clamp-4 sm:text-base">
            {/* Consistent padding for readability, adjusted text color, line height, line clamp */}
            {event.description || 'No description provided.'}
          </p>
          {/* Button Area - Responsive layout (stack vertically on small screens) */}
        </div>
      </Link>
    )
  }
)
