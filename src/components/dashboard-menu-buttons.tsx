"use client";

import {usePathname} from "next/navigation";
import {ReactNode} from "react";
import Link from "next/link";
import Image from "next/image";

export function DashboardButton(props: {href: string, children: ReactNode, imageUrl: string, imageAlt: string}) {

  const path = usePathname();

  let bgColor = 'bg-bgGray';
  if (path === props.href) {
    bgColor = 'bg-selectedPink';
  }
  return (
    <Link className={`w-full p-3 ${bgColor} text-baseText text-xl hover:bg-pinkText text-nowrap text-center ease-out duration-500 transition-all flex justify-between align-middle`} href={props.href}>
      <Image src={props.imageUrl} alt={props.imageAlt} width={32} height={32}/>
      <div className={'mt-auto mb-auto'}>
        {props.children}
      </div>
    </Link>
  )
}
