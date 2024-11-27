import { auth } from "@/auth";
import prisma from "@/db";
import VotingButton from "@/components/votelink";
import Image from "next/image";
import React from "react";
import {Metadata} from "next";

export const dynamic = 'force-dynamic';

export const metadata : Metadata = {
  title: 'Voter',
  description: 'Voter est le moyen le plus efficace de faire connaître le serveur, en plus, les membres qui votent reçoivent des récompenses !',
  openGraph: {
    title: 'Voter',
    description: 'Voter est le moyen le plus efficace de faire connaître le serveur, en plus, les membres qui votent reçoivent des récompenses !',
    url: 'https://www.ekaii.fr/vote',
    images: [
      {
        url: "https://sharex.ekaii.fr/u/E4Gmen.png"
      },
    ],
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Ekaii',
  }
}

export default async function Vote() {
  const session = await auth();
  const voteSites = await prisma.voteSite.findMany();

  const leaderboard = await prisma.monthlyLeaderboard.findMany();

  return (
    <>
      <h1
        className="font-monocraft text-4xl text-left shadow-underline w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10">Voter</h1>
      <div className={"relative -top-8 w-[95%] sm:w-3/4 md:w-2/3 2xl:w-1/2 p-3 pb-5 shadow-underline mx-auto text-justify text-lg"}>
        <p className={"leading-5 mt-3"}>
          Voter permet de faire connaître le serveur et de le faire monter dans les classements, permettant ainsi
          d&apos;agrandir notre communauté. Et comme on dit, plus on est de fous, plus on rit !<br/> Cela permet
          également de gagner des récompenses cosmétiques. Pour voter, il suffit de cliquer sur les liens ci-dessous :
        </p>
        <div className={"flex flex-wrap justify-evenly mt-7"}>
          {(session && session.user) ? voteSites.map((site) => (
            <VotingButton key={site.id} site={site} size={300}/>
          )) : <p className={'text-redText'}>Veuillez vous connecter pour voter</p>}
        </div>
      </div>
      <div className={'w-full md:w-1/2 p-3 pb-5 mx-auto text-justify text-lg'}>
        <h2 className={"font-monocraft text-2xl text-left"}>Classement des votes {(() => {
          const monthString = new Date().toLocaleString('fr-FR', {month: 'long'});
          const capitalizedMonth = monthString.charAt(0).toUpperCase() + monthString.slice(1);
          // if month start with a vowel, append d' instead of de
          if (['a', 'e', 'i', 'o', 'u'].includes(capitalizedMonth.charAt(0).toLowerCase())) {
            return `d'${capitalizedMonth}`;
          } else {
            return `de ${capitalizedMonth}`;
          }
        })()}</h2>
        <div className="w-full overflow-y-auto max-h-[21.8rem] scrollbar-hide border-b-bgDarkGray border-b-[3px] mt-10">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-10 bg-bgGray">
            <tr>
              <th>Rang</th>
              <th className="w-8"></th>
              <th>Pseudo</th>
              <th>Votes</th>
            </tr>
            </thead>
            <tbody>
            {leaderboard.length > 0 && leaderboard.map((entry, index) => (
              <React.Fragment key={entry.username}>
                <tr className={index === 0 ? 'sticky top-[30px] z-20 bg-basePink h-[48px]' : 'bg-bgLightGray'}>
                  <td
                    className={index === 0 ? 'border-y-darkPink border-solid border-y-[3px] border-l-[3px] border-l-darkPink p-2.5' : 'p-2.5 border-solid border-l-[3px] border-l-bgDarkGray'}># {index + 1}</td>
                  <td
                    className={index === 0 ? 'border-y-darkPink border-solid border-y-[3px] text-right relative' : 'text-right'}>
                    {index === 0 ? (
                      <Image src={'/images/first.svg'} alt="premier" width={40} height={40}
                             className={'absolute top-1/2 transform -translate-y-1/2 right-2 w-[40px] h-[40px]'}/>
                    ) : index === 1 ? (
                      <Image src={'/images/second.svg'} alt="deuxième" width={20} height={20} className={''}/>
                    ) : index === 2 ? (
                      <Image src={'/images/third.svg'} alt="troisième" width={20} height={20} className={''}/>
                    ) : null}
                  </td>
                  <td
                    className={index === 0 ? 'text-lg font-bold border-y-darkPink border-solid border-y-[3px]' : ''}>{entry.username}</td>
                  <td
                    className={index === 0 ? 'text-lg font-bold border-y-darkPink border-solid border-y-[3px] border-r-[3px] border-r-darkPink' : 'border-solid border-r-[3px] border-r-bgDarkGray'}>{entry.voteCount}</td>
                </tr>
                {index !== 0 && index !== leaderboard.length - 1 && (
                  <tr key={`${entry.username}-separator`} className={'bg-bgLightGray'}>
                    <td className="border-solid border-l-[3px] border-l-bgDarkGray border-r-[3px] border-r-bgDarkGray"
                        colSpan={4}>
                      <div className="h-[3px] w-[95%] bg-bgDarkGray mx-auto"/>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {leaderboard.length === 0 && (
              <tr className={'h-28'}>
                <td colSpan={4} className={'text-center italic'}>Aucun vote n&apos;a été enregistré pour le moment</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}