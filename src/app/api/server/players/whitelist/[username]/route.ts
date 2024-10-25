import {NextRequest, NextResponse} from "next/server";
import {checkAccess, isWhitelisterOrMore} from "@/api-auth";
import {addDashes} from "@/utils";
import {auth} from "@/auth";

export async function GET(req: NextRequest, props: {params: Promise<{username: string}>}) {
  const params = await props.params;
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isWhitelisterOrMore((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'whitelist.get');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const serverApiUrl = process.env.API_URL;
  const serverApiKey = process.env.API_KEY;
  if(!serverApiUrl) throw new Error("API URL not set");
  if(!serverApiKey) throw new Error("API Key not set");

  const playerUuid = await fetch( `https://api.mojang.com/users/profiles/minecraft/${params.username}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  if (playerUuid.status === 204 || playerUuid.status === 404) {
    return NextResponse.json({message: 'Player not found'}, {status: 404});
  }

  const playerUuidJson = addDashes((await playerUuid.json()).id);

  try {
    const res = await fetch(serverApiUrl + '/whitelist/' + playerUuidJson,
      {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          Authorization: 'Bearer ' + serverApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      })
    const resObj = await res.json();
    return NextResponse.json(resObj, {status: res.status});
  } catch (e) {
    return NextResponse.json({message: 'Server offline'}, {status: 503});
  }
}

export async function POST(req: NextRequest, props: {params: Promise<{username: string}>}) {
  const params = await props.params;
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isWhitelisterOrMore((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'whitelist.add');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const serverApiUrl = process.env.API_URL;
  const serverApiKey = process.env.API_KEY;
  if(!serverApiUrl) throw new Error("API URL not set");
  if(!serverApiKey) throw new Error("API Key not set");

  const playerUuid = await fetch( `https://api.mojang.com/users/profiles/minecraft/${params.username}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  if (playerUuid.status === 204 || playerUuid.status === 404) {
    return NextResponse.json({message: 'Player not found'}, {status: 404});
  }

  const playerUuidJson = addDashes((await playerUuid.json()).id);

  try {
    const res = await fetch(serverApiUrl + '/whitelist/' + playerUuidJson,
      {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          Authorization: 'Bearer ' + serverApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      })
    const resObj = await res.json();
    return NextResponse.json(resObj, {status: res.status});
  } catch (e) {
    return NextResponse.json({message: 'Server offline'}, {status: 503});
  }
}

export async function DELETE(req: NextRequest, props: {params: Promise<{username: string}>}) {
  const params = await props.params;
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isWhitelisterOrMore((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'whitelist.remove');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const serverApiUrl = process.env.API_URL;
  const serverApiKey = process.env.API_KEY;
  if(!serverApiUrl) throw new Error("API URL not set");
  if(!serverApiKey) throw new Error("API Key not set");

  const playerUuid = await fetch( `https://api.mojang.com/users/profiles/minecraft/${params.username}`, {
    method: 'GET',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  if (playerUuid.status === 204 || playerUuid.status === 404) {
    return NextResponse.json({message: 'Player not found'}, {status: 404});
  }

  const playerUuidJson = addDashes((await playerUuid.json()).id);

  try {
    const res = await fetch(serverApiUrl + '/whitelist/' + playerUuidJson,
      {
        method: 'DELETE',
        cache: 'no-cache',
        headers: {
          Authorization: 'Bearer ' + serverApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      })
    const resObj = await res.json();
    return NextResponse.json(resObj, {status: res.status});
  } catch (e) {
    return NextResponse.json({message: 'Server offline'}, {status: 503});
  }
}