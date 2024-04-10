import "./globals.css";
import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";

const varela = Varela_Round({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonytalk: Chatea anonimamente :)",
  description: "Chatea anonimamente en grupo en anonytalk.",
  metadataBase: new URL("https://anonytalk.vercel.app"),
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
          " bg-slate-50 dark:bg-zinc-900 max-w-screen-2xl mx-auto"
        }
      >
        {children}
      </body>
    </html>
  );
}
