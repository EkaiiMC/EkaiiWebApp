"use client";

import {ReactNode, useEffect, useState} from "react";
import Image from 'next/image';

function parseDate(date: number) {
  if (date === 0) return 'Donnée en cours de chargement...';
  return new Date(date).toLocaleTimeString();
}

function generatePlayerList(players: { name: string, uuid: string, lastLogin: string }[]) {
  if (!players) return <p>Donnée en cours de chargement...</p>;
  if (players.length === 0) return <PlayerCard player={{name: 'Aucun joueur connecté', uuid: '0', lastLogin: ''}}/>;
  let elmt: ReactNode[] = [];
  for (let player of players) {
    elmt.push(<PlayerCard player={player}/>);
  }
  return elmt;
}

function generateBannedPlayerList(players: { name: string, uuid: string, reason: string, date: string, source: string }[]) {
  if (!players) return <p>Donnée en cours de chargement...</p>;
  if (players.length === 0) return <PlayerCard player={{name: 'Aucun joueur banni', uuid: '0', lastLogin: ''}}/>;
  let elmt: ReactNode[] = [];
  for (const player of players) {
    elmt.push(<BannedPlayerCard player={player}/>);
  }
  return elmt;
}

function PlayerCard({player}: { player: { name: string, uuid: string, lastLogin: string } }) {
  const lastLoginString = player.lastLogin ? <p className={'text-lg'}>Connecté depuis le {new Date(player.lastLogin).toLocaleString()}</p> : '';

  return (
    <div className={'flex justify-start align-center bg-bgDarkGray p-2 m-2 h-[100px]'}>
      <Image src={'https://mc-heads.net/avatar/' + player.uuid + '/84'} width={84} height={84} alt={player.name}/>
      <div className={'text-left flex flex-col ml-2 overflow-hidden'}>
        <p className={'text-2xl font-bold'}>{player.name}</p>
        {lastLoginString}
      </div>
    </div>
  );
}

function BannedPlayerCard({player}: { player: { name: string, uuid: string, reason: string, date: string, source: string } }) {
  const lastLoginString = player.date ? <p className={'text-[10pt]'}>Banni le {new Date(player.date).toLocaleString()} par {player.source}</p> : '';

  return (
    <div className={'flex justify-start align-center bg-bgDarkGray p-2 m-2 h-[100px]'}>
      <Image src={'https://mc-heads.net/avatar/' + player.uuid + '/84'} width={84} height={84} alt={player.name}/>
      <div className={'text-left flex flex-col ml-2 overflow-hidden'}>
        <p className={'text-2xl font-bold'}>{player.name}</p>
        <p className={'text-lg'}>Raison: {player.reason}</p>
        {lastLoginString}
      </div>
    </div>
  );
}

export function OnlinePlayerList() {
  const [players, setPlayers] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    fetch('/api/server/players', {cache: 'no-cache'}).then(res => res.json()).then(data => {
      setPlayers(data.players);
      setLastUpdate(Date.now());
    });
    const intervalId = setInterval(() => {
      fetch('/api/server/players', {cache: 'no-cache'})
        .then(res => res.json())
        .then(data => {
          setPlayers(data.players);
          setLastUpdate(Date.now());
        });
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={'m-4 h-[95vh] bg-bgLighterGray w-1/2 p-2 overflow-hidden'}>
      <h1 className="text-4xl font-bold">Joueurs connectés</h1>
      <p className={'italic font-light text-[15px]'}>Dernière mise à jour: {parseDate(lastUpdate)}</p>
      <div className={'overflow-y-scroll h-[90%] overflow-auto'}>
        {generatePlayerList(players)}
      </div>
    </div>
  );
}

export function BannedPlayerList() {
  const [players, setPlayers] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(0);

  useEffect(() => {
    fetch('/api/server/players/banned', {cache: 'no-cache'}).then(res => res.json()).then(data => {
      setPlayers(data.players);
      setLastUpdate(Date.now());
    });
    const intervalId = setInterval(() => {
      fetch('/api/server/players/banned', {cache: 'no-cache'})
        .then(res => res.json())
        .then(data => {
          setPlayers(data.players);
          setLastUpdate(Date.now());
        });
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={'m-4 h-[95vh] bg-bgLighterGray w-1/2 p-2 overflow-hidden'}>
      <h1 className="text-4xl font-bold">Joueurs bannis</h1>
      <p className={'italic font-light text-[15px]'}>Dernière mise à jour: {parseDate(lastUpdate)}</p>
      <div className={'overflow-y-scroll h-[90%] overflow-auto'}>
        {generateBannedPlayerList(players)}
      </div>
    </div>
  );
}