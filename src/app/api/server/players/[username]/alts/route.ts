import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {checkAccess, isWhitelisterOrMore} from "@/api-auth";
import prisma from "@/db";

export async function GET(req: NextRequest, props: { params: { username: string } }) {
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
      const hasAccess = await checkAccess(key, 'players.alts');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const username = props.params.username;
  const belongsTo = await prisma.altAccount.findFirst({
    select: {
      belongsTo: true
    },
    where: {
      username: username
    }
  });

  if (!belongsTo) { // This account is not an alt
    const altAccounts = await prisma.altAccount.findMany({
      where: {
        belongsTo: username
      },
      select: {
        username: true
      }
    });
    return NextResponse.json({message: 'success', belongsTo: '', alts: altAccounts.map(a => a.username)});
  } else {
    return NextResponse.json({message: 'success', belongsTo: belongsTo.belongsTo, alts: []});
  }

}

export async function POST(req: NextRequest, props: { params: { username: string } }) {
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
      const hasAccess = await checkAccess(key, 'players.alts');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const body = await req.json();

  const username = props.params.username;
  const belongsTo = body.altAccUsername;

  if (!belongsTo) {
    return NextResponse.json({message: 'altAccUsername is required'}, {status: 400});
  }

  await prisma.altAccount.create({
    data: {
      username: belongsTo,
      belongsTo: username
    }
  });

  return NextResponse.json({message: 'success', username: belongsTo, belongsTo: username});
}

export async function DELETE(req: NextRequest, props: { params: { username: string } }) {
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
      const hasAccess = await checkAccess(key, 'players.alts');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const body = await req.json();

  const username = props.params.username;
  const belongsTo = body.altAccUsername as string;

  if (!belongsTo) {
    return NextResponse.json({message: 'altAccUsername is required'}, {status: 400});
  }

  await prisma.altAccount.delete({
    where: {
      username: belongsTo,
      belongsTo: username
    }
  });

  return NextResponse.json({message: 'success', username: belongsTo, belongsTo: username});
}