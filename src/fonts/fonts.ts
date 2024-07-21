import localFont from "next/font/local";
import {Rubik} from "next/font/google";

export const monocraft = localFont({
  display: "swap",
  src: "Monocraft.ttf",
  variable: "--font-monocraft",
  preload: true,
});
export const rubik = Rubik({ subsets: ["latin"] });