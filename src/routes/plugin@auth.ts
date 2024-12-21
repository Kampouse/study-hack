import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  (params) => ({
    providers: [
      GitHub({
        clientId: params.env.get("GITHUB_ID"),
        clientSecret: params.env.get("GITHUB_SECRET"),
      }),
    ],
  }),
);
