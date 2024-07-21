import {NextRequest, NextResponse} from "next/server";
import {checkAccess, isDeveloperOrMore} from "@/api-auth";
import {auth} from "@/auth";

export async function GET(req: NextRequest) {
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isDeveloperOrMore((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'server.stop');
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

  try {
    const res = await fetch(serverApiUrl + '/server/stop',
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
    return NextResponse.json({message: 'Server stopped'}, {status: 200});
  }
}