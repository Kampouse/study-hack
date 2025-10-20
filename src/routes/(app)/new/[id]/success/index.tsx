import { $, component$, useSignal } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { useLocation } from '@builder.io/qwik-city'
import * as Icons from 'lucide-qwik'

export default component$(() => {
  const location = useLocation()
  const showToast = useSignal(false)

  const copyToClipboard = $(() => {
    const eventUrl = `${window.location.origin}/join/${location.params.id}`
    navigator.clipboard.writeText(eventUrl).then(
      () => {
        showToast.value = true
        setTimeout(() => {
          showToast.value = false
        }, 3000)
      },
      err => {
        console.error('Could not copy text: ', err)
      }
    )
  })

  return (
    <div class="min-h-screen bg-[#FFF8F0]">
      <div class="container mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4">
        <div class="w-full max-w-lg rounded-2xl border border-[#E6D7C3] bg-gradient-to-br from-white/90 to-[#F8EDE3]/80 p-8 text-center shadow-md transition-all duration-300 hover:border-[#D98E73]/30 hover:shadow-lg">
          <div class="mb-6 rounded-full bg-[#F8D7BD] p-6 mx-auto inline-block">
            <Icons.CheckCircleIcon class="h-16 w-16 text-[#D98E73]" />
          </div>
          <h1 class="mb-4 text-3xl font-semibold tracking-tight text-[#5B3E29]">
            Success!
          </h1>
          <p class="mb-8 text-lg leading-relaxed text-[#6D5D4E]">
            You have successfully created the event. Share it with your friends
            to invite them to join!
          </p>
          <div class="flex flex-col gap-4">
            <Link
              href="/home"
              class="inline-flex items-center justify-center rounded-xl bg-[#D98E73] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#C27B62] active:scale-[0.98]"
            >
              <Icons.HomeIcon class="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <button
              onClick$={copyToClipboard}
              class="inline-flex items-center justify-center rounded-xl border border-[#D98E73] bg-transparent px-6 py-3 text-sm font-medium text-[#D98E73] shadow-sm transition-all duration-300 hover:bg-[#FFF1E6] active:scale-[0.98]"
            >
              <Icons.Share2Icon class="mr-2 h-5 w-5" />
              Share Event
            </button>
          </div>
        </div>

        {/* Toast notification */}
        <div
          class={`fixed bottom-4 right-4 flex items-center rounded-lg bg-[#5B3E29] px-4 py-3 text-white shadow-lg transition-opacity duration-300 ${showToast.value ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Icons.CheckIcon class="mr-2 h-5 w-5 text-[#F8D7BD]" />
          <span>Event link copied to clipboard!</span>
        </div>
      </div>
    </div>
  )
})
