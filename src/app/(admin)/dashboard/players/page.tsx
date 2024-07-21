"use client";

import {useEffect, useState} from "react";
import {BannedPlayerList, OnlinePlayerList} from "@/components/playerlists";

export default function PlayersPage() {

  const [count, setCount] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1)
    }, 1000)
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={'flex h-full text-center text-lg'}>
      <OnlinePlayerList />
      <BannedPlayerList />
    </div>
  );
}