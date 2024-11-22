import {NextRequest, NextResponse} from "next/server";
import {writeFile} from "fs/promises";
import prisma from "@/db";
import {logger} from "@/logger";
import {checkAccess, isDesignerOrMore, isWhitelisterOrMore} from "@/api-auth";
import {auth} from "@/auth";

export async function GET(req: NextRequest) : Promise<NextResponse> {
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
      const hasAccess = await checkAccess(key, 'gallery.list');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  return NextResponse.json(await prisma.galleryItem.findMany());
}

export async function POST(req: NextRequest) : Promise<NextResponse> {
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

  const formData = await req.formData();

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({error: 'No file provided'}, {status: 400});

  const title = formData.get('title') as string | null;
  if (!title) return NextResponse.json({error: 'No title provided'}, {status: 400});

  const author = formData.get('author') as string | null;
  if (!author) return NextResponse.json({error: 'No author provided'}, {status: 400});

  let rank = formData.get('rank') as string | null;
  if (!rank) {
    const count = await prisma.galleryItem.count();
    rank = (count + 1).toString();
  }

  const description = formData.get('description') as string | null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.replaceAll(' ', '_');
  const filePath = `/uploads/${fileName}`;
  try {
    await writeFile('public'+filePath, buffer);
    await prisma.galleryItem.create({
      data: {
        author,
        title,
        description,
        imagePath: filePath,
        rank: parseInt(rank)
      }
    });
    return NextResponse.json({success: 'File uploaded'});
  } catch (e) {
    logger.error(e);
    return NextResponse.json({error: 'Failed to upload file'}, {status: 500});
  }
}