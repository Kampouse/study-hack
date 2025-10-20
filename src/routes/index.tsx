import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import OG from '~/assets/just-rnd.png'
import Landing from './landing'
export default component$(() => {
  return <Landing />
})
export const head: DocumentHead = {
  title: 'Just RND | Collaborative Study Platform',
  meta: [
    {
      name: 'description',
      content:
        'Find study buddies nearby and collaborate with fellow students at different places in your city. Join study sessions and build connections.',
    },
    {
      name: 'og:title',
      content: 'Study Hack | Collaborative Study Platform',
    },
    {
      name: 'og:description',
      content:
        'Find study buddies nearby and collaborate with fellow students at different places in your city. Join study sessions and build connections.',
    },
    {
      name: 'og:image',
      content: OG,
    },
    {
      name: 'og:image:width',
      content: '1200',
    },
    {
      name: 'og:image:height',
      content: '630',
    },
    {
      name: 'og:url',
      content: 'https://www.justrnd.com',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'Just RND | Collaborative Study Platform',
    },
    {
      name: 'twitter:description',
      content:
        'Find study buddies nearby and collaborate with fellow students at different places in your city. Join study sessions and build connections.',
    },
    {
      name: 'twitter:image',
      content: OG,
    },
  ],
}
