import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google'
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme'
import { Toaster } from 'sonner'
import ReactQueryProvider from '@/react-query'
import { ReduxProvider } from '@/redux/provider'

const manrope = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "LUMORA",
  description: "Real-Time Video Messaging, Sharing & Streaming",
  icons: {
    icon: '/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <ReduxProvider>
            <ReactQueryProvider>
                {children}
                <Analytics />
                <Toaster />
                </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
