import Image from "next/image";
import Navbar from "@/components/displays/Navbar";

export default function Header() {
  return (
      <header className={"bg-navbarGradient h-[120px] fixed w-full z-50"}>
          <Navbar />
      </header>
  )
}