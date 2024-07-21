import {ReactNode} from "react";
import Layout from "@/components/start";

export default function PageLayout({children}: { children: ReactNode }) {
  return (
    <Layout type={"other"}>
      {children}
    </Layout>
  )
}