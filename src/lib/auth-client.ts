import { createAuthClient } from "better-auth/react";

// Define trusted domains - should match the ones in auth.ts
const TRUSTED_DOMAINS = [
  'http://localhost:3000', // Development
  'https://lumora-web.vercel.app',
  'https://lumora.vagarth.in',
];

// Dynamically determine the base URL based on the current domain with security validation
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: validate the current origin against trusted domains
    const currentOrigin = window.location.origin;
    
    if (TRUSTED_DOMAINS.includes(currentOrigin)) {
      return currentOrigin;
    }
    
    // If current origin is not trusted, log warning and fallback to safe default
    console.warn(`Untrusted origin detected: ${currentOrigin}. Falling back to safe default.`);
    
    // Fallback to the primary production domain
    return 'https://lumora-web.vercel.app';
  }
  
  // Server-side fallback
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.NEXT_PUBLIC_HOST_URL || 'https://lumora-web.vercel.app';
};

export const authClient = createAuthClient({
  baseURL: getBaseURL()
});

export type Session = typeof authClient.$Infer.Session; 