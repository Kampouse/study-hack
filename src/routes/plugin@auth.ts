import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import Google from "@auth/qwik/providers/google";

export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  (params) => ({
    providers: [
      GitHub({
        clientId: params.env.get("GITHUB_ID"),
        clientSecret: params.env.get("GITHUB_SECRET"),
      }),
      Google({
        clientId: params.env.get("GOOGLE_ID"),
        clientSecret: params.env.get("GOOGLE_SECRET"),
      }),
    ],
  }),
);
