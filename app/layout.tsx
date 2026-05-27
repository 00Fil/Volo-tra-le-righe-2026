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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
        	href="https://fonts.googleapis.com/css2?family=Borel&family=Space+Grotesk:wght@700&display=swap"
        	rel="stylesheet"
        />
        <head/>
      <body>{children}</body>
    </html>
  );
}
