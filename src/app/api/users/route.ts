import {NextRequest, NextResponse} from "next/server";
import {checkAccess, isMaintainer} from "@/api-auth";
import {auth} from "@/auth";
import prisma from "@/db";

export const dynamic = 'force-dynamic';

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
      const hasAccess = await checkAccess(key, 'users.get');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, {status: 200});
  } catch (e) {
    return NextResponse.json({message: 'Failed to fetch users'}, {status: 500});
  }
}