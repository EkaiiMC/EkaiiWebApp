import {ReactNode} from "react";
import Header from "@/components/header";

export default function PageLayout({children}: { children: ReactNode }) {
  return (
    <>
      <Header/>
      {children}
    </>
  )
}
