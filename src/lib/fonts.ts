import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

/** Display + body grotesque (the "emotional" voice). */
export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/** Monospaced technical voice for kickers, indices, tags and the terminal footer. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});
