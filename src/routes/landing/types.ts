export interface Space {
  id: number
  name: string
  location: string
  description: string
  tags: string[]
  rating: number
  badge: string
  image: string
  creator: string
}

export interface Event {
  id: number
  title: string
  type: string
  date: string
  time: string
  location: string
  attendees: number
  badge: string
  image: string
  creator: string
}

export interface LandingPageProps {
  spaces: Space[]
  events: Event[]
}
