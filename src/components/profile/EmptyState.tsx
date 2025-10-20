import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
// Import specific icons you might need
import {
  BellIcon,
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
  UsersIcon,
} from 'lucide-qwik'

// Define possible contexts for the empty state, using icon names for clarity
type EmptyStateContext =
  | 'CalendarIcon'
  | 'MapPinIcon'
  | 'UsersIcon'
  | 'PackageIcon'
  | 'BellIcon'

interface EmptyStateProps {
  context: EmptyStateContext // Determines which icon to show
  title: string
  message: string
  actionButton?: { label: string; href: string }
}

/**
 * Selects an icon component based on the provided context.
 */
const getIconForContext = (context: EmptyStateContext): any => {
  switch (context) {
    case 'CalendarIcon': // Represents events
      return CalendarIcon
    case 'MapPinIcon': // Represents places
      return MapPinIcon
    case 'UsersIcon': // Represents friends or groups
      return UsersIcon
    case 'BellIcon': // Represents requests
      return BellIcon
    case 'PackageIcon': // Represents a generic or default state
    default:
      // Fallback for safety, though type checking should prevent invalid values

      console.warn(
        `Unexpected EmptyStateContext value: ${context}. Defaulting to PackageIcon.`
      )

      return PackageIcon
  }
}

/**
 * Displays a message indicating an empty state for a list (e.g., no events, no places).
 * The icon is determined internally based on the `context` prop.
 * Can optionally include an action button.
 *
 * Takes:
 * - `context`: A string literal representing an icon name (e.g., 'CalendarIcon', 'BellIcon') to determine the icon.
 * - `title`: The main heading for the empty state message.
 * - `message`: A descriptive message explaining the empty state.
 * - `actionButton`: (Optional) An object with `label` and `href` for a call-to-action Link button.
 *
 * Example Usage:
 * ```tsx
 * // For events
 * <EmptyState
 *   context="CalendarIcon"
 *   title="No Upcoming Events"
 *   message="You haven't joined any events yet."
 *   actionButton={{ label: "Explore Events", href: "/events" }}
 * />
 *
 * // For places
 * <EmptyState
 *   context="MapPinIcon"
 *   title="No Saved Places"
 *   message="You haven't saved any places yet."
 * />
 *
 * // For requests
 * <EmptyState
 *   context="BellIcon"
 *   title="No Pending Requests"
 *   message="You don't have any pending requests at the moment."
 * />
 * ```
 */
export const EmptyState = component$<EmptyStateProps>(
  ({ context, title, message, actionButton }) => {
    // Get the appropriate icon based on the context
    const Icon = getIconForContext(context)

    return (
      // Increased padding for empty state
      <div class="col-span-full py-20 text-center md:py-24">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8D7BD]/50 text-[#D98E73]">
          {' '}
          {/* Larger icon container */}
          {/* Render the selected icon */}
          <Icon class="h-10 w-10" /> {/* Larger icon */}
        </div>
        <h3 class="mb-3 text-2xl font-semibold text-[#5B3E29]">{title}</h3>{' '}
        {/* Larger title */}
        <p class="mx-auto mb-8 max-w-lg text-lg text-[#6D5D4E]">{message}</p>{' '}
        {/* Larger message */}
        {actionButton && (
          <Link
            href={actionButton.href}
            // Larger button padding
            class="inline-flex items-center rounded-lg bg-[#D98E73] px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#C27B62] focus:outline-none focus:ring-2 focus:ring-[#D98E73] focus:ring-offset-2 focus:ring-offset-[#FFF8F0]"
          >
            {actionButton.label}
          </Link>
        )}
      </div>
    )
  }
)
