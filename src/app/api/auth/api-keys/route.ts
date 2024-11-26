import {NextRequest, NextResponse} from "next/server";
import {ApiScope, checkAccess, generateApiKey, getKeys, isMaintainer} from "@/api-auth";
import {auth} from "@/auth";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isMaintainer((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'keys.create');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  if(!req.body) return NextResponse.json({message: 'No body provided'}, {status: 400});

  let keyName : string;
  let keyScopes : ApiScope;

  try {
    const body = await req.json();
    keyName = body.name;
    keyScopes = body.scopes as ApiScope;
  } catch (e) {
    return NextResponse.json({message: 'Invalid body'}, {status: 400});
  }

  // Create key
  const generated = await generateApiKey(keyName, keyScopes)

  return NextResponse.json(generated, {status: 201});
}

export async function GET(req: NextRequest) {
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isMaintainer((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'keys.access');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  return NextResponse.json(await getKeys(), {status: 200});
}