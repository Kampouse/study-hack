import type { RequestHandler } from "@builder.io/qwik-city";
export const onGet: RequestHandler = async (req) => {
  //get the auth data from the request

  const activePath = req.url.pathname;
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
    "/landing": "public",
    "/landing/": "public",
  };

  type Session = {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
  } | null;
  const data = req.sharedMap.get("session") as Session;

  //get current session time and compare with expires time
  if (data) {
    const currentTime = new Date().getTime();
    const sessionDate = new Date(data.expires).getTime();
    if (currentTime > sessionDate) {
      throw req.redirect(302, "/login");
    }
  }

  if (!data?.user) {
    const keys = Object.keys(publicpath);
    if (keys.includes(activePath)) {
      return req.next();
    }
    throw req.redirect(302, "/landing");
  }

  //string contain method
};
