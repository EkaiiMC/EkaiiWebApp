import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-darkerGray w-full">
          <Image src="/images/404.svg" alt="404" className="w-[60vw] h-auto min-h-[125px] mb-3" height={1000} width={1000} />
          <div className="flex flex-row w-[35vw] items-center justify-center">
            <Image src="/images/vanille.svg" alt="vanille" className="w-auto h-[96px] mb-10" height={96} width={96} />
            <p className="text-white text-lg relative leading-6 ml-2">
              <span className="font-semibold">Oh dis ! </span>
              La page recherchée est introuvable.<br />
              Code d&apos;erreur : <span className="font-semibold">404</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}