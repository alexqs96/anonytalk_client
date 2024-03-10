import "./globals.css";
import type { Metadata } from "next";
import DarkModeProvider from "@/components/DarkMode";
import { Varela_Round } from "next/font/google";

const varela = Varela_Round({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonytalk: Chatea anonimamente :)",
  description: "Chatea anonimamente en grupo en anonytalk.",
  metadataBase: new URL('https://anonytalk.vercel.app'),
  openGraph: {
    type: "website",
    url: "https://anonytalk.vercel.app",
    title: "Anonytalk: Chatea anonimamente :)",
    siteName: "Anonytalk: Chatea anonimamente :)",
    description: "Chatea anonimamente en grupo en anonytalk.",
    images: "/img/og_image.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={
          varela.className +
          " bg-[#f8f8f8] dark:bg-slate-900 max-w-screen-2xl mx-auto"
        }
      >
        <DarkModeProvider>
          <main>{children}</main>
        </DarkModeProvider>
      </body>
    </html>
  );
}
