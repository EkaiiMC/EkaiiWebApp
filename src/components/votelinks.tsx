"use client";

import {VoteSite} from "@prisma/client";
import Link from "next/link";

export default function VoteLinks({isConnected, voteSites}: { isConnected: boolean, voteSites: VoteSite[] }) {

  if (isConnected) {
    return (
      <div className={"mt-8 mb-4"}>
        <div className={"flex flex-col justify-center items-center"}>
          {voteSites.map((site) => {
            fetch(`/api/vote/${site.id}`).then((res) => {
              res.json().then((data) => {
                console.log(data)
              })
            })
            return (
            <Link key={site.id} href={site.url} target={"_blank"} rel={"noreferrer noopener"} className={"text-center text-lg text-blue-500 underline mt-2"}>
              {site.title}
            </Link>
          )})}
        </div>
      </div>
    )
  } else {
    return (
      <div className={"mt-8 mb-4"}>
        <h2 className={"text-lg text-redText text-center"}>Veuillez vous connecter pour voter</h2>
      </div>
    )
  }
}