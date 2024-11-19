export async function getPlayerUUIDFromUsername(username: string) {
  const playerUuid = await fetch( `https://api.mojang.com/users/profiles/minecraft/${username}`, {
    method: 'GET',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  if (playerUuid.status === 204 || playerUuid.status === 404) {
    return undefined;
  }

  return addDashes((await playerUuid.json()).id);
}

export async function getPlayerUsernameFromUUID(uuid: string) {
  const playerUuid = removeDashes(uuid);
  const playerUsername = await fetch( `https://sessionserver.mojang.com/session/minecraft/profile/${playerUuid}`, {
    method: 'GET',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  if (playerUsername.status === 204 || playerUsername.status === 404 || playerUsername.status === 400) {
    return undefined;
  }

  return (await playerUsername.json()).name;
}

export function addDashes(uuid: string) {
  return uuid.slice(0, 8) + '-' + uuid.slice(8, 12) + '-' + uuid.slice(12, 16) + '-' + uuid.slice(16, 20) + '-' + uuid.slice(20);
}

export function removeDashes(uuid: string) {
  return uuid.replace(/-/g, '');
}