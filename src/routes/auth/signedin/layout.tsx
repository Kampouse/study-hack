import type { RequestHandler } from "@builder.io/qwik-city";
export const onGet: RequestHandler = async ({ redirect }) => {
  throw redirect(302, "/app");





  //if there is no platform session, we need to create one
  //we can create a new session with the user data
  //detect if the user is new or not and create the platform

  //make a Platform session where  we can store the session data with more data from the user

  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/

  //if (url.pathname == "/" && session) throw redirect(302, "/app");
};
