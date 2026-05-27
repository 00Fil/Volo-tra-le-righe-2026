import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Volo tra le righe",
	description: "Playlist narrativa — Il gioco della salamandra",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="it">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Borel&family=Space+Grotesk:wght@700&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>{children}</body>
		</html>
	);
}
