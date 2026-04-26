import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Volo tra le righe | Playlist",
  description:
    "Elaborato playlist ispirato a Il gioco della salamandra di Davide Longo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
