import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {checkAccess, isMaintainer} from "@/api-auth";
import prisma from "@/db";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, props: { params : { id: string }}) {
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

  const id = props.params.id;
  if (!id) {
    return NextResponse.json({message: 'Missing id'}, {status: 400});
  }

  const site = await prisma.voteSite.findUnique({where: {id}});

  if (!site) {
    return NextResponse.json({message: 'Site not found'}, {status: 404});
  }

  return NextResponse.json(site);
}

export async function PATCH(req: NextRequest, props: { params : { id: string }}) {
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
      const hasAccess = await checkAccess(key, 'votesites.update');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const id = props.params.id;

  if (!id) {
    return NextResponse.json({message: 'Missing id'}, {status: 400});
  }

  const body = await req.json();

  const siteV = await prisma.voteSite.findUnique({where: {id}});

  if (!siteV) {
    return NextResponse.json({message: 'Site not found'}, {status: 404});
  }

  const site = await prisma.voteSite.update({
    where: { id },
    data: body
  });

  return NextResponse.json(site);
}

export async function DELETE(req: NextRequest, props: { params : { id: string }}) {
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
      const hasAccess = await checkAccess(key, 'votesites.delete');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const id = props.params.id;

  if (!id) {
    return NextResponse.json({message: 'Missing id'}, {status: 400});
  }

  const site = await prisma.voteSite.findUnique({where: { id }});

  if (!site) {
    return NextResponse.json({message: 'Site not found'}, {status: 404});
  }

  await prisma.voteSite.delete({where: { id }});
  return new NextResponse(undefined, {status: 204});
}