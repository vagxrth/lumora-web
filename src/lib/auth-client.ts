import { createAuthClient } from "better-auth/react";

// Use localhost in development, production URL otherwise
const getBaseURL = () => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // In production, use the environment variable
  const baseURL = process.env.NEXT_PUBLIC_HOST_URL;
  
  if (!baseURL) {
    throw new Error(
      "NEXT_PUBLIC_HOST_URL is not defined for production environment."
    );
  }
  
  return baseURL;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL()
});

export type Session = typeof authClient.$Infer.Session; 