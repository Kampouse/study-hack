import type { RequestHandler } from '@builder.io/qwik-city'
export const onGet: RequestHandler = async ({ redirect, pathname }) => {
  if (pathname == '/app') {
    throw redirect(302, '/home')
  }
}
