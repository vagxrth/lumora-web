import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { client } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  socialProviders: { 
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
    } 
  },
  // Disable email and password authentication
  emailAndPassword: {
    enabled: false,
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_HOST_URL!,
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ],
  // Updated to use the new config format
  advanced: {
    database: {
      generateId: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user; 