import {ButtonArray} from "@/components/navbar";
import {LoginButton} from "@/components/buttons";

export default function Header() {
  return (
    <header className="bg-navbarGradient h-[120px] fixed w-full z-50">
      <nav className="flex justify-between mt-3 ml-5 mr-5">
        <ButtonArray />
        <LoginButton />
      </nav>
    </header>
  )
}