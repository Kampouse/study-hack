import { component$ } from '@builder.io/qwik'
import { Form } from '@builder.io/qwik-city'
import type { RequestHandler } from '@builder.io/qwik-city'
import { GithubIcon, GoogleIcon } from '~/components/icons'
import { useSignIn } from '../plugin@auth'
import JustRnd from './justrnd.png?jsx'
export const onGet: RequestHandler = async req => {
  type Session = {
    user: {
      name: string
      email: string
      image: string
    }
    expires: string
  } | null
  const data = req.sharedMap.get('session') as Session
  //get current session time and compare with expires time
  if (data) {
    const currentTime = new Date().getTime()
    const sessionDate = new Date(data.expires).getTime()
    if (currentTime < sessionDate) {
      throw req.redirect(302, '/home')
    }
  }
}

export default component$(() => {
  const signin = useSignIn()
  return (
    <div class="relative min-h-screen bg-gradient-to-b from-[#A67C52] to-[#C49A6C] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background pattern and glow effects */}
      <div class="absolute inset-0 bg-[url('/cozy-pattern.svg')] opacity-10"></div>
      <div class="opacity-15 absolute inset-0">
        <div class="absolute left-1/4 top-1/4 h-32 w-32 animate-pulse rounded-full bg-[#DDB892] blur-xl"></div>
        <div class="absolute right-1/4 top-3/4 h-24 w-24 animate-pulse rounded-full bg-[#C8976E] blur-xl"></div>
      </div>

      {/* Main content */}
      <div class="relative flex min-h-[80vh] flex-col items-center justify-center">
        <div class="w-full max-w-md space-y-4">
          {/* Logo container with glow effect */}
          <div class="relative">
            <div class="absolute -inset-6 rounded-3xl bg-gradient-to-r from-[#F0D9B5] to-[#C8976E] opacity-20 blur-xl"></div>
            <div class="relative flex justify-center">
              <JustRnd class="h-64 w-64" />
            </div>
          </div>

          {/* Welcome text */}
          <div class="text-center">
            <h2 class="text-3xl font-bold text-[#FEFAF6]">Welcome Back</h2>
            <p class="mt-2 text-[#E6CCB2]">
              Sign in to continue your cozy journey
            </p>
          </div>

          {/* Auth buttons */}
          <div class="mt-8 space-y-4">
            <button
              onClick$={() => {
                signin.submit({
                  providerId: 'github',
                  redirectTo: '/auth/signedin',
                })
              }}
              class="group relative flex w-full transform items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#2D333B] px-6 py-4 text-lg font-medium text-[#FEFAF6] shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(45,51,59,0.4)]"
            >
              <GithubIcon />
              <span class="text-lg font-semibold">Continue with GitHub</span>
              <span class="absolute inset-0 z-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
            </button>
            <Form action={signin} class="w-full">
              <input type="hidden" name="providerId" value="google" />
              <input
                type="hidden"
                name="options.redirectTo"
                value="/auth/signedin"
              />
              <button class="group relative flex w-full transform items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#DDB892] to-[#C8976E] px-6 py-4 text-lg font-medium text-[#FEFAF6] shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(221,184,146,0.4)]">
                <span class="relative z-10 flex flex-row gap-2">
                  <GoogleIcon />
                  <span class="relative z-10 text-lg font-semibold">
                    Continue with Google
                  </span>
                </span>

                <span class="absolute inset-0 bg-gradient-to-r from-[#C8976E] to-[#DDB892] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
})
