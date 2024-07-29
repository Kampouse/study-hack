import type { RequestHandler } from "@builder.io/qwik-city";
export const onGet: RequestHandler = async ({
  next,
  url,
  sharedMap,
  redirect,
}) => {
  //get the auth data from the request

  const activePath = url.pathname;
  //type of key value pair object
  type publicpath = { [key: string]: string };

  const publicpath: publicpath = {
    "/": "public",
    "/about": "public",
    "/contact": "public",
    "/login/": "public",
    "/login": "public",
    "/signup": "public",
    "/logout": "public",
  };
  if (publicpath[activePath] === "public") {
    return next();
  }
  type Session = {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
  } | null;
  const data = sharedMap.get("session") as Session;
  //get current session time and compare with expires time
  if (data) {
    const currentTime = new Date().getTime();
    const sessionDate = new Date(data.expires).getTime();
    if (currentTime > sessionDate) {
      throw redirect(302, "/login");
    }
  }
  if (!data) {
    throw redirect(302, "/");
  }
};
