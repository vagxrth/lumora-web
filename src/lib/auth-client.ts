import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_HOST_URL
});

export type Session = typeof authClient.$Infer.Session; 