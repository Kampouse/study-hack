import type { RequestHandler } from "@qwik.dev/router";
export const onGet: RequestHandler = async ({ redirect, pathname }) => {
  if (pathname == "/app") {
    throw redirect(302, "/home");
  }
};
