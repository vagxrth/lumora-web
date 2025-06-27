import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_HOST_URL;

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_HOST_URL is not defined."
  );
}

export const authClient = createAuthClient({
  baseURL
});

export type Session = typeof authClient.$Infer.Session; 