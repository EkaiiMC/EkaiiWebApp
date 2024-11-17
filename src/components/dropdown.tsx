"use client";

import {useState} from "react";
import Link from "next/link";

export default function Dropdown({ children } : { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (event: any) => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="z-40 relative -top-[4.5px]">

        <button
          onClick={toggleDropdown}
          className={`inline-flex items-center justify-center w-full border-[3px] border-bgLightGray shadow-sm p-2 h-[40px] bg-bgGray font-light text-baseText z-50 hover:border-bgDarkGray ease-out duration-500 transition-all ${isOpen ? 'no-active' : ''}`}
        >
          <div className="icon-container mr-2">
            <div className={`bar bar1 ${isOpen ? 'bar1-open' : ''}`}></div>
            <div className={`bar bar2 ${isOpen ? 'bar2-open' : ''}`}></div>
            <div className={`bar bar3 ${isOpen ? 'bar3-open' : ''}`}></div>
          </div>
          Menu
        </button>

        <div
          className={`origin-top-left absolute left-0 mt-2 w-56 shadow-lg bg-bgGray transition-all duration-500 text-baseText z-40 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <Link href="/" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-x-bgLightGray border-t-bgLightGray border-[3px] border-b-transparent hover:border-bgDarkGray ease-out duration-500 transition-all"
                  role="menuitem">
              Accueil
            </Link>
            <Separator/>
            <Link href="/vote" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-[3px] border-basePink hover:border-darkPink ease-out duration-500 transition-all bg-pinkText"
                  role="menuitem">
              Voter
            </Link>
            <Separator/>
            <Link href="/dynmap" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-x-bgLightGray border-[3px] border-y-transparent hover:border-bgDarkGray ease-out duration-500 transition-all"
                  role="menuitem">
              Dynmap
            </Link>
            <Separator/>
            <Link href="/join" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-x-bgLightGray border-[3px] border-y-transparent hover:border-bgDarkGray ease-out duration-500 transition-all"
                  role="menuitem">
              Nous rejoindre
            </Link>
            <Separator/>
            <Link href="/about" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-x-bgLightGray border-[3px] border-y-transparent hover:border-bgDarkGray ease-out duration-500 transition-all"
                  role="menuitem">
              À propos
            </Link>
            <Separator/>
            <Link href="/gallery" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-x-bgLightGray border-[3px] border-y-transparent hover:border-bgDarkGray ease-out duration-500 transition-all"
                  role="menuitem">
              Galerie
            </Link>
            <Separator/>
            <Link href="/modpack" onClick={toggleDropdown}
                  className="block px-4 py-2 text-sm border-x-bgLightGray login:border-b-bgLightGray border-b-transparent border-[3px] border-t-transparent hover:border-bgDarkGray ease-out duration-500 transition-all"
                  role="menuitem">
              Modpack
            </Link>
            <div className={'login:hidden'}>
              <Separator />
              <div onClick={toggleDropdown}>
                {children}
              </div>
            </div>
            <div className={"absolute top-0 right-0 h-full w-[3px] bg-bgLightGray -z-50"}/>
            <div className={"absolute top-0 left-0 h-full w-[3px] bg-bgLightGray -z-50"}/>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 w-full h-2/3 bg-navbarMobileGradient transition-all duration-500 z-0 pointer-events-none ${isOpen ? 'opacity-50 visible' : 'opacity-0 invisible'}`}/>
    </>
  );
}

function Separator() {
  return (
    <div className={"relative mx-auto h-[3px] w-[90%] bg-bgLightGray"}/>
  )
}