import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Image from "next/image";

export default async function LogoutPage() {
  const session = await auth();

  if (!session || !session.user) {
    return redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-grow flex justify-center items-center bg-homeBackground bg-cover">
        <div className={'flex flex-col justify-center items-center w-full'}>
          <div
            className={'bg-bgGray border-bgDarkGray border-[3px] mx-auto w-3/4 sm:w-[400px] h-[225px] p-4 flex flex-col justify-between content-center'}>
            <div>
              <div className={'flex flex-row justify-center'}><h1 className={'min-[410px]:text-4xl text-3xl font-monocraft text-center mb-3'}>Déconnexion</h1></div>
              <p className={'text-lg min-[410px]:text-xl text-justify'}>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            </div>
            <form className={'flex justify-center'} action={
              async () => {
                "use server"
                await signOut()
              }
            }>
              <button
                className={'bg-pinkText border-[3px] border-basePink hover:border-darkPink p-1.5 text-lg mx-auto transition-colors transition-500 mt-5'}>Se
                déconnecter
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}