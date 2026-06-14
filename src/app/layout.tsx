import type { Metadata, Viewport } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import AppShell from "@/components/AppShell";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import "../styles/globals.scss";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
  title: "MSU x Hackathon",
  description: "Event & Ticket Dashboard",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MSU Events",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b12",
};

const noto = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-thai",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={noto.className}>
        <MantineProvider>
          <AppShell>{children}</AppShell>
        </MantineProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}