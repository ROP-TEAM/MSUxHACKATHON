import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "MSU x Hackathon",
  description: "MSU x Hackathon",
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
        {children}
      </body>
    </html>
  );
}