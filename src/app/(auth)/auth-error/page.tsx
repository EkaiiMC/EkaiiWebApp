"use client";

import {useSearchParams} from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {Suspense} from "react";

enum ErrorType {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification"
}

const errorMap = {
  [ErrorType.Configuration]: (
    <span className={''}>Configuration</span>
  ),
  [ErrorType.AccessDenied]: (
    <span className={''}>Accès refusé</span>
  ),
  [ErrorType.Verification]: (
    <span className={''}>Vérification</span>
  ),
}

function AuthError() {
  const search = useSearchParams();
  const error = search.get('error') as ErrorType;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex justify-center items-center bg-homeBackground bg-cover">
        <div className={'flex flex-col justify-center items-center w-full'}>
          <div
            className={'bg-bgGray border-bgDarkGray border-[3px] mx-auto w-3/4 sm:w-[400px] h-[225px] p-4 flex flex-col content-center'}>
            <h1 className={'min-[410px]:text-2xl text-xl font-monocraft text-center mb-3'}>Une erreur s&apos;est produite !</h1>
            <p className={'text-lg min-[410px]:text-xl text-justify'}>
              Pas de panique, signalez juste cette erreur sur notre <a href={'https://github.com/EkaiiMC/EkaiiWebApp/issues'} className={'underline hover:text-pinkText visited:text-basePink'}>GitHub</a> !
            </p>
            <p className={'text-lg font-light mt-2'}>Code d&apos;erreur : {errorMap[error] || "Erreur"}</p>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthError />
    </Suspense>
  )
}