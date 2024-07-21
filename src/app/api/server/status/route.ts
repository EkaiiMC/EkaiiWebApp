import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
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
    const resObj = await res.json();
    return NextResponse.json(resObj);
  } catch (err: unknown) {
    return NextResponse.json({
      status: '200',
      statusText: 'OK',
      isOnline: false,
      onlinePlayers: 0,
      maxPlayers: 0,
    }, {status: 200});
  }
}