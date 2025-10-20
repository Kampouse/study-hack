import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { Tag } from './Tag'
export type LocationCardProps = {
  name: string
  description: string
  address: string
  tags: string[]
  rating: number
  image: string
  id: number
  link: string
}

export const ShareLocationCard = component$(() => {
  const suggestedTags = ['Wi-Fi', 'Open Late']

  return (
    <div class="from-warm-50 hover:from-warm-100/30 flex h-full max-h-[26em] flex-col overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br to-gray-50/50 p-4 shadow-lg transition-all duration-300 hover:border-green-200 hover:to-gray-50/70 hover:shadow-xl md:block">
      <article class="flex h-full flex-col justify-between">
        <header class="relative flex w-full flex-col overflow-hidden rounded-xl">
          <div class="from-warm-100/30 aspect-[16/9] w-full bg-gradient-to-br to-gray-100/50"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </header>
        <div class="mt-4 flex w-full flex-col text-start">
          <h2 class="text-xl font-semibold tracking-tight text-gray-800">
            Share Your Cozy Study Spot
          </h2>
          <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
            Know a perfect place for studying? Help your fellow students
            discover hidden gems and create a welcoming community!
          </p>
        </div>
        <div class="mt-4 flex flex-wrap justify-start gap-2">
          {suggestedTags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>
        <div class="mt-auto flex justify-start py-2">
          <Link
            href="/places/new"
            class="group flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-black px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 4v16m8-8H4" />
            </svg>
            Share a Place
          </Link>
        </div>
      </article>
    </div>
  )
})

export const LocationCard = component$((props: LocationCardProps) => {
  return (
    <div
      class="to-gray -100/50 flex h-full max-h-[26em] flex-col overflow-hidden rounded-2xl border border-gray-300 bg-gradient-to-br
from-white/80 p-4 shadow-sm transition-all duration-300 hover:border-green-100 hover:bg-gradient-to-br hover:from-white/90 hover:to-gray-50/70 hover:shadow-md md:block"
    >
      <article class="flex flex-1 flex-col overflow-hidden rounded-2xl md:block">
        <header class="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
          <div class="aspect-[16/9] w-full">
            <img
              loading="lazy"
              src={props.image}
              class="size-full absolute inset-0 object-cover"
              alt=""
              width={1000}
              height={1000}
            />
          </div>
        </header>
        <div class="mt-2.5 flex flex-col gap-2">
          <div class="flex items-center gap-2 text-sm font-medium text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <address class="not-italic">{props.address}</address>
          </div>
          <h2 class="text-lg font-semibold tracking-tight text-gray-900">
            {props.name}
          </h2>
          <p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
            {props.description}
          </p>
        </div>
        <div class="mt-2.5 flex flex-wrap gap-2">
          {props.tags.map((tag, index) => (
            <Tag key={index} text={tag} />
          ))}
        </div>
        <div class="mt-auto pt-4">
          <Link
            href={'/places/' + props.id}
            class="flex items-center justify-center gap-0.5 overflow-hidden rounded-xl bg-black px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Learn more
          </Link>
        </div>
      </article>
    </div>
  )
})
