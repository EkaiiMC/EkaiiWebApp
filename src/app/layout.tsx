import type {Metadata, Viewport} from "next";
import "./globals.css";
import {monocraft, rubik} from "@/fonts/fonts";

export const metadata: Metadata = {
  title: {default: "Ekaii", template: "Ekaii | %s"},
  description: "Ekaii a pour objectif d'être la survie Minecraft ultime. Sans plugins, sans claims, sans resets. Le jeu, tel qu'il est. Et vous ? Quand allez-vous créer votre propre histoire sur Ekaii ?",
  keywords: ["minecraft", "survie", "vanilla", "serveur", "communauté", "jeu", "jeu vidéo", "jeux vidéo", "ekaii", "ekaii.fr"],
  openGraph: {
    title: "Accueil",
    description: "Ekaii a pour objectif d'être la survie Minecraft ultime. Sans plugins, sans claims, sans resets. Le jeu, tel qu'il est. Et vous ? Quand allez-vous créer votre propre histoire sur Ekaii ?",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/155087037?s=200&v=4",
        width: 64,
        height: 64,
      },
    ],
    url: "https://www.ekaii.fr",
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Ekaii',
  },
};

export const viewport: Viewport = {
  themeColor: "#e25697",
}

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
