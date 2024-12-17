import type { RequestHandler } from "@qwik.dev/router";

export const onGet: RequestHandler<{ path: string }> = async ({
  params,
  json,
}) => {
  // put your DB access here (hard coding data for simplicity)
  json(200, { pathname: params.path });
};
