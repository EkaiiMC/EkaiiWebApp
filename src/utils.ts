import {logger} from "@/logger";

const STATUS_CACHE_MINUTES = 1;
const DISCORD_MEMBERS_CACHE_MINUTES = 24 * 60; // 24 hours

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

let cachedServerStatus: any = null;
let cacheTimestampStatus: number | null = null;

export async function getServerStatus() {
  const cacheDuration = STATUS_CACHE_MINUTES * 60 * 1000; // 1 minute in milliseconds

  if (cachedServerStatus !== null && cacheTimestampStatus !== null) {
    const now = new Date().getTime();
    if (now - cacheTimestampStatus < cacheDuration) {
      logger.debug('Returning cached server status');
      return cachedServerStatus;
    } else {
      logger.debug('Cache expired');
    }
  }

  const serverApiUrl = process.env.API_URL;
  const serverApiKey = process.env.API_KEY;
  if (!serverApiUrl) throw new Error("API URL not set");
  if (!serverApiKey) throw new Error("API Key not set");

  try {
    const res = await fetch(serverApiUrl + '/server/ping', {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        Authorization: 'Bearer ' + serverApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }
    });
    const resJson = await res.json();
    cachedServerStatus = resJson;
    cacheTimestampStatus = new Date().getTime();
    return resJson;
  } catch (err: unknown) {
    const status = {
      status: '200',
      statusText: 'OK',
      isOnline: false,
      onlinePlayers: 0,
      maxPlayers: 0,
    };
    cachedServerStatus = status;
    cacheTimestampStatus = new Date().getTime();
    return status;
  }
}

let cachedMemberCount: number | null = null;
let cacheTimestamp: number | null = null;

export async function getDiscordMembersCount() {
  const cacheDuration = DISCORD_MEMBERS_CACHE_MINUTES * 60 * 1000;

  if (cachedMemberCount !== null && cacheTimestamp !== null) {
    const now = new Date().getTime();
    if (now - cacheTimestamp < cacheDuration) {
      logger.debug(`Returning cached member count: ${cachedMemberCount}`);
      return cachedMemberCount;
    } else {
      logger.debug('Cache expired');
    }
  }

  if (!process.env.DISCORD_BOT_TOKEN) throw new Error('Discord bot token not set');
  if (!process.env.DISCORD_GUILD_ID) throw new Error('Discord guild ID not set');
  if (!process.env.DISCORD_MEMBER_ROLE_ID) throw new Error('Discord member role ID not set');

  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const memberRoleID = process.env.DISCORD_MEMBER_ROLE_ID;
  let memberCount = 0;
  const query = new URLSearchParams({
    limit: '1000',
  });
  try {
    const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?${query.toString()}`, {
      headers: {
        Authorization: `Bot ${token}`,
      },
      next: {
        revalidate: 60 * 60 * 24
      }
    });

    const members : {roles : string[]}[] = await res.json();

    members.forEach((member) => {
      if(member.roles.includes(memberRoleID)) {
        memberCount++;
      }
    });

    cachedMemberCount = memberCount;
    cacheTimestamp = new Date().getTime();

    return memberCount;
  } catch (err: unknown) {
    logger.error(err);
    return 0;
  }
}