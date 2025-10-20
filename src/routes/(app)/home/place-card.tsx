import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import {
  MapPinIcon as MapPin,
  StarIcon as Star,
  UsersIcon as Users,
} from 'lucide-qwik'

export const PlaceCard = component$(
  (props: {
    place: {
      id: number
      name: string
      image: string
      badge: string
      location: string
      description: string
      tags: string[]
      creator: string
      rating: number
    }
  }) => {
    return (
      <Link
        key={props.place.id}
        href={'/places/' + encodeURI(props.place.name)}
        class="group overflow-hidden rounded-xl border-none bg-white shadow-md transition-all duration-300 ease-in-out "
      >
        <div class="relative aspect-[4/3] overflow-hidden">
          <img
            src={props.place.image || '/placeholder.svg'}
            width={400}
            height={300}
            alt={props.place.name}
            class="h-full w-full  object-cover transition-transform"
          />
          <div class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-[#D98E73]">
            {props.place.badge}
          </div>
        </div>
        <div class="bg-white p-5">
          <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin class="h-4 w-4 text-[#D98E73]" />
            <span class="truncate">{props.place.location}</span>
          </div>
          <div>
            <h3 class="mb-1 text-lg font-semibold text-[#5B3E29] transition-colors duration-300 group-hover:text-[#D98E73]">
              {props.place.name}
            </h3>
            <p class="mb-3 line-clamp-2 text-sm text-[#6D5D4E]">
              {props.place.description}
            </p>
          </div>
          <div class="mb-3 flex flex-wrap gap-2">
            {props.place.tags.map((tag: string) => (
              <span
                key={tag}
                class="rounded-full bg-[#F8D7BD] px-2 py-1 text-xs text-[#8B5A2B]"
              >
                {tag}
              </span>
            ))}
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 text-sm">
              <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8D7BD]">
                <Users class="h-3 w-3 text-[#8B5A2B]" />
              </div>
              <span class="text-[#8B5A2B]">By {props.place.creator}</span>
            </div>
            <div class="flex items-center gap-1">
              <Star class="h-4 w-4 fill-[#D98E73] text-[#D98E73]" />
              <span class="font-medium text-[#5B3E29]">
                {Math.round(props.place.rating * 10) / 10}
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }
)
