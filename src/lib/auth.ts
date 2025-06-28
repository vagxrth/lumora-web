import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./prisma";

const isDev = process.env.NODE_ENV === 'development';

// Define all your trusted domains
const trustedDomains = [
  'https://lumora-web.vercel.app',
  'https://lumora.vagarth.in',
];

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  socialProviders: { 
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    } 
  },
  emailAndPassword: {
    enabled: false,
  },
  baseURL: isDev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_HOST_URL,
  trustedOrigins: [
    ...(isDev ? ['http://localhost:3000'] : []),
    ...trustedDomains,
  ],
  advanced: {
    database: {
      generateId: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user; 