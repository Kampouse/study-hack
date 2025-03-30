import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const demoSpaces = [
    {
      id: 1,
      name: "Place Tranquile Montreal",
      location: "Montréal, QC",
      description:
        "A peaceful haven with comfortable seating and the best coffee in town. Take in stunning city views from our rooftop seating area.",
      tags: ["Wi-Fi", "Quiet", "Rooftop"],
      rating: 4.9,
      badge: "Community Pick",
      image:
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y296eSUyMGNhZmV8ZW58MHx8MHx8fDA%3D&w=400&q=80",
      creator: "Marie L.",
    },
    {
      id: 2,
      name: "Café Coeur",
      location: "Mile End, Montréal",
      description:
        "A charming neighborhood café with homemade pastries and vintage decor. Perfect for solo work or intimate gatherings.",
      tags: ["Food", "Cozy", "Quiet"],
      rating: 4.8,
      badge: "Hidden Gem",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y296eSUyMGNhZmV8ZW58MHx8MHx8fDA%3D&w=400&q=80",
      creator: "Jean M.",
    },
    {
      id: 3,
      name: "The Book Nook",
      location: "Plateau, Montréal",
      description:
        "An indie bookstore and café hybrid with reading nooks and weekly book clubs. Browse our curated collection while sipping artisanal tea.",
      tags: ["Books", "Tea", "Events"],
      rating: 4.7,
      badge: "Cultural Hub",
      image:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Ym9va3N0b3JlfGVufDB8fDB8fHww&w=400&q=80",
      creator: "Sarah K.",
    },
  ];

  const demoEvents = [
    {
      id: 1,
      title: "JavaScript Fundamentals Workshop",
      type: "Study Group",
      date: "April 15",
      time: "2:00 PM",
      location: "Place Tranquile Montreal",
      attendees: 8,
      badge: "Community Event",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29kZXJzfGVufDB8fDB8fHww&w=250&q=80",
      creator: "Alex K.",
    },
    {
      id: 2,
      title: "Monthly Book Club: 'The Midnight Library'",
      type: "Book Discussion",
      date: "April 18",
      time: "6:30 PM",
      location: "The Book Nook",
      attendees: 12,
      badge: "Cultural Event",
      image:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D&w=250&q=80",
      creator: "Sarah K.",
    },
    {
      id: 3,
      title: "Watercolor & Wine Evening",
      type: "Art Workshop",
      date: "April 20",
      time: "7:00 PM",
      location: "Café Coeur",
      attendees: 15,
      badge: "Creative Session",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0ZXJjb2xvcnxlbnwwfHwwfHx8MA%3D%3D&w=250&q=80",
      creator: "Emma P.",
    },
  ];

  return (
    <div class="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-white">
      {/* Hero Section */}
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F8EDE3] to-transparent py-32">
        <div class="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div class="container relative mx-auto px-4">
          <div class="grid items-center gap-16 lg:grid-cols-2">
            <div class="space-y-10">
              <h1 class="text-5xl font-bold leading-tight tracking-tight text-[#5B3E29] md:text-7xl">
                Create & Discover
                <br />
                <span class="bg-gradient-to-r from-[#D98E73] to-[#C27B62] bg-clip-text text-transparent">
                  Cozy Gatherings
                </span>
              </h1>
              <p class="max-w-xl text-xl leading-relaxed text-[#6D5D4E]">
                A premium community platform where you can discover and share
                Montreal's coziest spots and connect through meaningful events.
              </p>
              <div class="flex flex-col gap-4 sm:flex-row">
                <button class="group flex transform items-center justify-center gap-2 rounded-xl bg-[#D98E73] px-8 py-4 text-lg font-medium text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-[#C27B62]">
                  Join Our Community
                  <svg
                    class="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <button class="flex transform items-center justify-center gap-2 rounded-xl border-2 border-[#D98E73] px-8 py-4 text-lg font-medium text-[#D98E73] transition duration-300 hover:scale-105 hover:bg-[#FFF1E6]">
                  How It Works
                </button>
              </div>
            </div>
            <div class="relative">
              <div class="absolute -inset-4 rounded-3xl bg-[#D98E73] opacity-10 blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y296eSUyMGNhZmV8ZW58MHx8MHx8fDA%3D&w=600&q=80"
                alt="Cozy workspace in Montreal"
                class="relative w-full transform rounded-3xl shadow-2xl transition duration-700 hover:scale-[1.02]"
                width={600}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section class="bg-white py-24">
        <div class="container mx-auto px-4">
          <h2 class="mb-16 text-center text-4xl font-bold tracking-tight text-[#5B3E29]">
            <span class="border-b-4 border-[#D98E73] pb-2">
              Our Three Pillars
            </span>
          </h2>
          <div class="grid gap-8 md:grid-cols-3">
            <div class="rounded-2xl bg-[#FFF8F0] p-8 text-center transition-all duration-300 hover:-translate-y-2">
              <div class="mb-6 inline-block rounded-full bg-[#D98E73] p-4">
                <svg
                  class="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 class="mb-4 text-2xl font-semibold text-[#5B3E29]">Create</h3>
              <p class="text-[#6D5D4E]">
                Share your favorite cozy spots and organize meaningful events
                that bring people together.
              </p>
            </div>
            <div class="rounded-2xl bg-[#FFF8F0] p-8 text-center transition-all duration-300 hover:-translate-y-2">
              <div class="mb-6 inline-block rounded-full bg-[#D98E73] p-4">
                <svg
                  class="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <h3 class="mb-4 text-2xl font-semibold text-[#5B3E29]">Share</h3>
              <p class="text-[#6D5D4E]">
                Connect with like-minded individuals and build a community
                around your favorite spaces.
              </p>
            </div>
            <div class="rounded-2xl bg-[#FFF8F0] p-8 text-center transition-all duration-300 hover:-translate-y-2">
              <div class="mb-6 inline-block rounded-full bg-[#D98E73] p-4">
                <svg
                  class="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="mb-4 text-2xl font-semibold text-[#5B3E29]">Join</h3>
              <p class="text-[#6D5D4E]">
                Discover and participate in events that match your interests and
                expand your social circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Spaces */}
      <section class="py-24">
        <div class="container mx-auto px-4">
          <h2 class="mb-16 text-center text-4xl font-bold tracking-tight text-[#5B3E29]">
            <span class="border-b-4 border-[#D98E73] pb-2">
              Curated Community Spaces
            </span>
          </h2>
          <div class="grid gap-8 md:grid-cols-3">
            {demoSpaces.map((space) => (
              <div
                key={space.id}
                class="group transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div class="relative overflow-hidden">
                  <img
                    src={space.image}
                    alt={space.name}
                    class="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
                    width={400}
                    height={300}
                  />
                  <div class="absolute right-4 top-4">
                    <span class="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#D98E73] backdrop-blur-sm">
                      {space.badge}
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <div class="mb-3 flex items-center gap-2 text-[#6D5D4E]">
                    <svg
                      class="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    <span class="text-sm">{space.location}</span>
                  </div>
                  <h3 class="mb-3 text-xl font-semibold text-[#5B3E29] transition duration-300 group-hover:text-[#D98E73]">
                    {space.name}
                  </h3>
                  <p class="mb-4 text-sm leading-relaxed text-[#6D5D4E]">
                    {space.description}
                  </p>
                  <div class="flex justify-between">
                    <div class="flex gap-2">
                      {space.tags.map((tag, index) => (
                        <span
                          key={index}
                          class="rounded-full bg-[#F8D7BD] px-3 py-1 text-xs font-medium text-[#8B5A2B]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div class="flex items-center gap-1 text-[#D98E73]">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="font-semibold">{space.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section class="py-24">
        <div class="container mx-auto px-4">
          <h2 class="mb-16 text-center text-4xl font-bold tracking-tight text-[#5B3E29]">
            <span class="border-b-4 border-[#D98E73] pb-2">
              What Our Community Says
            </span>
          </h2>
          <div class="grid gap-8 md:grid-cols-3">
            <div class="rounded-2xl bg-white p-8 shadow-xl">
              <div class="mb-6 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Sarah M."
                  class="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h4 class="text-lg font-semibold text-[#5B3E29]">Sarah M.</h4>
                  <p class="text-sm text-[#6D5D4E]">Digital Nomad</p>
                </div>
              </div>
              <p class="text-[#6D5D4E]">
                "I've discovered amazing hidden gems and made genuine
                connections through this platform. The community events are
                thoughtfully curated and always memorable."
              </p>
            </div>
            <div class="rounded-2xl bg-white p-8 shadow-xl">
              <div class="mb-6 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="David L."
                  class="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h4 class="text-lg font-semibold text-[#5B3E29]">David L.</h4>
                  <p class="text-sm text-[#6D5D4E]">Local Artist</p>
                </div>
              </div>
              <p class="text-[#6D5D4E]">
                "As an artist, finding inspiring spaces to work is essential.
                This platform has introduced me to perfect spots and a
                supportive community of creative minds."
              </p>
            </div>
            <div class="rounded-2xl bg-white p-8 shadow-xl">
              <div class="mb-6 flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Marie C."
                  class="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <h4 class="text-lg font-semibold text-[#5B3E29]">Marie C.</h4>
                  <p class="text-sm text-[#6D5D4E]">Student</p>
                </div>
              </div>
              <p class="text-[#6D5D4E]">
                "The study groups and workshops have been invaluable for my
                learning journey. I've found amazing study spots and met
                wonderful people who share my interests."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Community Events */}
      <section class="bg-[#FFF1E6] py-24">
        <div class="container mx-auto px-4">
          <h2 class="mb-16 text-center text-4xl font-bold tracking-tight text-[#5B3E29]">
            <span class="border-b-4 border-[#D98E73] pb-2">
              Upcoming Community Events
            </span>
          </h2>
          <div class="grid gap-8 md:grid-cols-2">
            {demoEvents.map((event) => (
              <div
                key={event.id}
                class="group flex transform overflow-hidden rounded-2xl bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div class="relative w-2/5">
                  <img
                    src={event.image}
                    alt={event.title}
                    class="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    width={250}
                    height={300}
                  />
                  <div class="absolute left-4 top-4">
                    <span class="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#D98E73] backdrop-blur-sm">
                      {event.badge}
                    </span>
                  </div>
                </div>
                <div class="flex-1 p-8">
                  <span class="mb-3 inline-block rounded-full bg-[#FFF1E6] px-4 py-1 text-sm font-semibold text-[#D98E73]">
                    {event.type}
                  </span>
                  <h3 class="mb-4 text-xl font-semibold text-[#5B3E29] transition duration-300 group-hover:text-[#D98E73]">
                    {event.title}
                  </h3>
                  <div class="space-y-4 text-sm text-[#6D5D4E]">
                    <div class="flex items-center gap-3">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                      </svg>
                      <span class="font-medium">
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div class="flex items-center gap-3">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <svg
                        class="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <button class="mt-6 flex transform items-center gap-2 rounded-xl bg-[#D98E73] px-8 py-3 text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-[#C27B62]">
                    Join Event
                    <svg
                      class="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="bg-gradient-to-b from-[#3A2A1D] to-[#2A1D10] py-16 text-white">
        <div class="container mx-auto px-4">
          <div class="grid gap-12 md:grid-cols-4">
            <div>
              <h3 class="mb-6 text-xl font-semibold text-[#D98E73]">
                Justd R&D
              </h3>
              <p class="text-[#E6D7C3]">
                Discover and connect through Montreal's coziest community
                platform.
              </p>
            </div>
            <div>
              <h3 class="mb-6 text-xl font-semibold text-[#D98E73]">
                Community
              </h3>
              <ul class="space-y-3 text-[#E6D7C3]">
                <li class="flex items-center gap-2 transition duration-300 hover:text-[#D98E73]">
                  Share Spaces
                </li>
                <li class="flex items-center gap-2 transition duration-300 hover:text-[#D98E73]">
                  Create Events
                </li>
              </ul>
            </div>
            <div>
              <h3 class="mb-6 text-xl font-semibold text-[#D98E73]">
                Contact Us
              </h3>
              <ul class="space-y-3 text-[#E6D7C3]">
                <li>
                  <Link
                    href="mailto:hello@justdrd.com"
                    class="flex items-center gap-2 transition duration-300 hover:text-[#D98E73]"
                  >
                    <svg
                      class="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    hello@justdrd.com
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="mb-6 text-xl font-semibold text-[#D98E73]">
                Join Our Newsletter
              </h3>
              <div class="flex">
                <input
                  placeholder="Your email"
                  class="w-full rounded-l-xl bg-white/10 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#D98E73]"
                />
                <button class="transform rounded-r-xl bg-[#D98E73] px-6 py-3 font-medium transition duration-300 hover:scale-105 hover:bg-[#C27B62]">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});
