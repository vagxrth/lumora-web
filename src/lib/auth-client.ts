import { createAuthClient } from "better-auth/react";

// Dynamically determine the base URL based on the current domain
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use the current origin
    return window.location.origin;
  }
  // Server-side fallback
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.NEXT_PUBLIC_HOST_URL;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL()
});

export type Session = typeof authClient.$Infer.Session; 