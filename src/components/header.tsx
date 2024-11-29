import {ButtonArray} from "@/components/navbar";
import {DropdownLoginButton, LoginButton} from "@/components/buttons";
import Dropdown from "@/components/dropdown";

export default function Header() {
  return (
    <header className="navbar:bg-navbarGradient h-[120px] fixed w-full z-20">
      <nav className="justify-between mt-3 ml-5 mr-5 hidden navbar:flex">
        <ButtonArray />
        <LoginButton />
      </nav>
      <nav className={'nav-transition'}>
        <div className="navbar:hidden flex mt-3 ml-5 mr-5 justify-between">
          <Dropdown>
            <DropdownLoginButton />
          </Dropdown>
          <div className={'hidden login:block'}>
            <LoginButton />
          </div>
        </div>
      </nav>
    </header>
  )
}