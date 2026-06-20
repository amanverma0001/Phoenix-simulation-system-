import type React from "react"
import type { Metadata, Viewport } from "next"
import { Orbitron, Rajdhani } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { EntropyProvider } from "@/lib/EntropyContext"
import "./globals.css"

const _geistMono = Geist_Mono({ subsets: ["latin"] })

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-orbitron"
})
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-rajdhani"
})

export const metadata: Metadata = {
  title: "PHOENIX | Geopolitical Collapse Simulator",
  description:
    "Interactive cyberpunk geopolitical collapse simulator. Watch system stability crumble and discover emergent winners and losers.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${rajdhani.variable} font-sans antialiased bg-black`} suppressHydrationWarning>
        <div className="noise-overlay" />
        <div className="scanline-overlay pointer-events-none opacity-[0.03]" />
        <EntropyProvider>
          {children}
        </EntropyProvider>
        <Analytics />
      </body>
    </html>
  )
}
