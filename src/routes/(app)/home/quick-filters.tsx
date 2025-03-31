import { component$ } from "@builder.io/qwik";
import {
  CoffeeIcon as Coffee,
  WifiIcon as Wifi,
  BookOpenIcon as BookOpen,
  VolumeXIcon as VolumeX,
  ZapIcon as Zap,
  MusicIcon as Music,
} from "lucide-qwik";

export const QuickFilters = component$(() => {
  return (
    <div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-full border border-[#E6D7C3] bg-white px-4 py-2 shadow-lg">
      <div class="flex gap-3">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-[#D98E73] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Coffee class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-[#D98E73] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Wifi class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-[#D98E73] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <BookOpen class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-[#D98E73] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <VolumeX class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-[#D98E73] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Zap class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-transparent p-0 text-[#D98E73] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Music class="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});