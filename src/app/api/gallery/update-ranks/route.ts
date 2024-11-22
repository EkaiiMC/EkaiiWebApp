import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import {auth} from "@/auth";
import {checkAccess, isDesignerOrMore} from "@/api-auth";

export async function PATCH(req: NextRequest) {
  const key = req.headers.get('Authorization')?.split(' ')[1];
  if (!key) {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    if(!isDesignerOrMore((session.user as {role: string}).role)) {
      return NextResponse.json({message: 'Forbidden'}, {status: 403});
    }
  } else {
    try {
      const hasAccess = await checkAccess(key, 'gallery.create');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  try {
    const updatedRanks = await req.json() as { id: string, rank: string }[];

    for (const { id, rank } of updatedRanks) {
      await prisma.galleryItem.update({
        where: { id },
        data: { rank: parseInt(rank) },
      });
    }

    return NextResponse.json({ message: 'Ranks updated successfully' });
  } catch (error) {
    console.error('Error updating ranks:', error);
    return NextResponse.json({ message: 'Failed to update ranks' }, { status: 500 });
  }
}