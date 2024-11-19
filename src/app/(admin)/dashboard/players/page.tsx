"use client";

import {useEffect, useState} from "react";
import {BannedPlayerList, OnlinePlayerList} from "@/components/playerlists";

export default function PlayersPage() {
  return (
    <div className={'flex h-full text-center text-lg'}>
      <OnlinePlayerList />
      <BannedPlayerList />
    </div>
  );
}