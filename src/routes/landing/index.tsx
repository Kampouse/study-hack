import { component$ } from "@builder.io/qwik";
import { JoinCommunity } from "./JoinCommunity";
import { CommunityEventsSection } from "./CommunityEvent";
import { CommunitySpacesSection } from "./CommunitySpaceSection";
import { ThreePillarsSection } from "./ThreePillarsSection";
import { HeroSection } from "./HeroSection";
import { TestimonialsSection } from "./TestimonialsSection";

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
  const demoEvent = [
    {
      id: 1,
      title: "Coffee & Crochet Circle",
      type: "Workshop",
      date: "June 15",
      time: "2:00 PM",
      location: "Place Tranquile Montreal",
      attendees: 12,
      badge: "Beginner Friendly",
      image:
        " https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMGNsdWJ8ZW58MHx8MHx8fDA%3D&w=400&q=80",

      creator: "Sarah K.",
    },
    {
      id: 2,
      title: "Book Club: Montreal Stories",
      type: "Book Discussion",
      date: "June 18",
      time: "6:30 PM",
      location: "The Book Nook",
      attendees: 15,
      badge: "Monthly Event",
      image:
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9vayUyMGNsdWJ8ZW58MHx8MHx8fDA%3D&w=400&q=80",
      creator: "Marie L.",
    },
  ];
  return (
    <>
      <HeroSection />
      <ThreePillarsSection />
      <CommunitySpacesSection spaces={demoSpaces} />
      <TestimonialsSection />
      <CommunityEventsSection events={demoEvent} />
      <JoinCommunity />
    </>
  );
});
