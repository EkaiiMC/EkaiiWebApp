import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {checkAccess, isDesignerOrMore, isMaintainer} from "@/api-auth";
import prisma from "@/db";

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
      const hasAccess = await checkAccess(key, 'votesites.list');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const sites = await prisma.voteSite.findMany();
  return NextResponse.json(sites);
}

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
      const hasAccess = await checkAccess(key, 'votesites.create');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const body = await req.json()

  const title = body.title;
  const url = body.url;

  if (!title || !url) {
    return NextResponse.json({message: 'Missing title or url'}, {status: 400});
  }

  const site = await prisma.voteSite.create({
    data: {
      title,
      url
    }
  });

  return NextResponse.json(site);
}