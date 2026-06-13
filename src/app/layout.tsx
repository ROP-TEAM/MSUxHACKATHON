import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import AppShell from "@/components/AppShell";
import "../styles/globals.scss";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export const metadata: Metadata = {
  title: "MSU x Hackathon",
  description: "Event & Ticket Dashboard",
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
      </body>
    </html>
  );
}