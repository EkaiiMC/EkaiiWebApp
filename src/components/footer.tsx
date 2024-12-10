import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative flex justify-between items-center h-16 bg-bgDarkGray text-white py-10 text-center text-[12pt] sm:px-10 font-extralight w-full sm:text-lg sm:text-left mt-auto">
      <p>Copyright © 2024 EkaiiMC - Tous droits réservés - Non affilié à Mojang ou Microsoft - <Link href={'http://www.serveurs-minecraft.org'}>Serveur Minecraft</Link></p>
    </footer>
  )
}