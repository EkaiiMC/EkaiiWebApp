import {NextRequest, NextResponse} from "next/server";
import {checkAccess, isMaintainer} from "@/api-auth";
import {auth} from "@/auth";
import prisma from "@/db";

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

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
      const hasAccess = await checkAccess(key, 'users.edit');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const body = await req.json();

  try {
    await prisma.user.update({
      where: {
        id
      },
      data: body
    });
    return NextResponse.json({message: 'User updated'}, {status: 200});
  } catch (e) {
    return NextResponse.json({message: 'Failed to update user'}, {status: 500});
  }
}