import {auth, signIn} from "@/auth";
import {redirect} from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default async function LoginPage() {
  const session = await auth();

  if (session && session.user) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-grow flex justify-center items-center bg-homeBackground bg-cover">
        <div className={'flex flex-col justify-center items-center w-full'}>
          <div
            className={'bg-bgGray border-bgDarkGray border-[3px] mx-auto w-3/4 sm:w-[400px] h-[225px] p-4 flex flex-col justify-between content-center flex-wrap'}>
            <div>
              <h1 className={'min-[410px]:text-4xl text-3xl font-monocraft text-center mb-3'}>Connexion</h1>
              <p className={'text-lg min-[410px]:text-xl text-justify'}>Connectez vous à votre compte Minecraft !</p>
            </div>
            <form className={'flex justify-center'} action={
              async () => {
                "use server"
                await signIn("microsoft-entra-id")
              }
            }>
              <button
                className={'bg-pinkText border-[3px] border-basePink hover:border-darkPink p-1.5 text-lg mx-auto transition-colors transition-500 mt-5'}>Se connecter
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}