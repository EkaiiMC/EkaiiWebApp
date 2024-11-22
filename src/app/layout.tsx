import type { Metadata } from "next";
import "./globals.css";
import {monocraft, rubik} from "@/fonts/fonts";

export const metadata: Metadata = {
  title: {default: "Ekaii", template: "Ekaii | %s"},
  description: "Ekaii a pour objectif d'être la survie Minecraft ultime. Sans plugins, sans claims, sans resets. Le jeu, tel qu'il est. Et vous ? Quand allez-vous créer votre propre histoire sur Ekaii ?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={'h-full'}>
      <body className={`${rubik.className} ${monocraft.variable} min-h-full`}>
        {children}
      </body>
    </html>
  );
}
