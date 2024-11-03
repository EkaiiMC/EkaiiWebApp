import {NextResponse} from "next/server";

export function addDashes(uuid: string) {
  return uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
}

export function hasDashboardAccess(role: string) {
  return role === 'WHITELISTER' || role === 'DESIGNER' || role === 'DEVELOPER' || role === 'MAINTAINER';
}

export function getVotingDelta(site: string): Date {
  switch (site) {
    case 'serveur-prive.net':
      return new Date(90 * 60 * 1000);
    default:
      throw new Error('Unknown voting site');
  }
}

export async function getServerStatus() {
  const serverApiUrl = process.env.API_URL;
  const serverApiKey = process.env.API_KEY;
  if(!serverApiUrl) throw new Error("API URL not set");
  if(!serverApiKey) throw new Error("API Key not set");

  try {
    const res = await fetch(serverApiUrl + '/server/ping',
      {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          Authorization: 'Bearer ' + serverApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      })
    return await res.json();
  } catch (err: unknown) {
    return {
      status: '200',
      statusText: 'OK',
      isOnline: false,
      onlinePlayers: 0,
      maxPlayers: 0,
    };
  }
}
