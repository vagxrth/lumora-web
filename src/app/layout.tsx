import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google'
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme'
import { Toaster } from 'sonner'
import ReactQueryProvider from '@/react-query'
import { ReduxProvider } from '@/redux/provider'

  const manrope = DM_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: false
})

export const metadata: Metadata = {
  title: "LUMORA",
  description: "Real-Time Video Recording & Sharing Platform",
  icons: {
    icon: '/lumora.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={manrope.className} suppressHydrationWarning>
        <div className="bg-[#171717]">
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
        </div>
      </body>
    </html>
  );
}
