import { component$ } from '@builder.io/qwik'
import {
  CalendarIcon as Calendar,
  HeartIcon as Heart,
  UserPlusIcon as UserPlus,
  UsersIcon as Users,
} from 'lucide-qwik'
import type { StatsType } from '~/routes/profile/types'

interface ProfileStatsProps {
  stats: StatsType
}

/**
 * Displays key statistics for the user profile in a card format.
 *
 * Takes:
 * - `stats`: An object containing the counts for various statistics
 *            (`upcomingEvents`, `hostedEvents`, `savedPlaces`, `connections`).
 *
 * Example Usage:
 * ```tsx
 * const statsData = useComputed$(() => ({ upcomingEvents: 5, hostedEvents: 2, ... }));
 * <ProfileStats stats={statsData.value} />
 * ```
 */
export const ProfileStats = component$<ProfileStatsProps>(({ stats }) => {
  // Ensure the icons passed here match the IconComponent type implicitly
  const statItems: { label: string; value: number; icon: any }[] = [
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar },
    { label: 'Hosted Events', value: stats.hostedEvents, icon: UserPlus },
    { label: 'Saved Places', value: stats.savedPlaces, icon: Heart },
    { label: 'Connections', value: stats.connections, icon: Users },
  ]

  return (
    <section class="container relative z-20 -mt-10 mb-10 px-4 md:px-6">
      <div class="rounded-xl bg-white p-6 shadow-lg md:p-8">
        <div class="grid grid-cols-2 gap-5 text-center md:grid-cols-4 md:gap-8">
          {statItems.map(item => (
            <div
              key={item.label}
              class="flex flex-col items-center justify-center rounded-lg bg-[#FFF8F0]/60 p-5 transition-colors hover:bg-[#F8EDE3]/60"
            >
              <item.icon class="mb-2 h-7 w-7 text-[#D98E73]" />
              <p class="text-3xl font-bold text-[#D98E73] md:text-4xl">
                {item.value}
              </p>
              <p class="mt-1 text-sm font-medium text-[#6D5D4E]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})
