import {NextRequest, NextResponse} from "next/server";
import prisma from "@/db";
import {logger} from "@/logger";
import {checkAccess, isDesignerOrMore, isWhitelisterOrMore} from "@/api-auth";
import {auth} from "@/auth";

export const dynamic = 'force-dynamic';

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

  if(!process.env.ZIPLINE_URL || !process.env.ZIPLINE_TOKEN || !process.env.ZIPLINE_PUBLIC_URL) {
    logger.error('Env is not configured');
    return NextResponse.json({error: 'env not configured'}, {status: 500});
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

  let builder = formData.get('builder') as string | null;
  if (!builder) builder = 'Inconnu';

  // GalleryCoords
  let coords : any = undefined;
  const coords_x = formData.get('coords_x') as string | null;
  const coords_y = formData.get('coords_y') as string | null;
  const coords_z = formData.get('coords_z') as string | null;
  const coords_dimension = formData.get('coords_dimension') as 'overworld' | "nether" | "end" | null;
  if (coords_x && coords_y && coords_z && coords_dimension) {
    coords = {
      x: parseFloat(coords_x),
      y: parseFloat(coords_y),
      z: parseFloat(coords_z),
      dimension: coords_dimension
    };
  }

  const description = formData.get('description') as string | null;

  try {
    const formDataZipline = new FormData();
    formDataZipline.append('file', file);
    const res = await fetch(process.env.ZIPLINE_URL+'/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ZIPLINE_TOKEN,
        'Accept': 'application/json'
      },
      body: formDataZipline
    });

    if (!res.ok) {
      logger.error('Failed to upload file, returned status: '+res.status);
      return NextResponse.json({error: 'Failed to upload file'}, {status: 500});
    }
    const data = await res.json();
    const filePathRes = data.files[0];
    const fileName = filePathRes.split('/').pop();
    const filePath = process.env.ZIPLINE_PUBLIC_URL+'/u/'+fileName;

    await prisma.galleryItem.create({
      data: {
        author,
        title,
        description,
        coords: coords,
        builder,
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