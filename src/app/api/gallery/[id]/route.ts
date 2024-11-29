import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {checkAccess, isDesignerOrMore} from "@/api-auth";
import prisma from "@/db";
import {logger} from "@/logger";

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) : Promise<NextResponse> {
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
      const hasAccess = await checkAccess(key, 'gallery.delete');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  if(!process.env.ZIPLINE_URL || !process.env.ZIPLINE_TOKEN) {
    logger.error('Env is not configured');
    return NextResponse.json({error: 'env not configured'}, {status: 500});
  }

  const id = (await props.params).id;
  const item = await prisma.galleryItem.findUnique({where: {id}});
  if (!item) return NextResponse.json({error: 'Item not found'}, {status: 404});

  try {
    const fileName = item.imagePath.split('/').pop();
    if (!fileName) return NextResponse.json({error: 'Failed to delete item, error when parsing fileName'}, {status: 500});
    // first get all images to get the id of the image to delete
    const resGet = await fetch(process.env.ZIPLINE_URL + '/api/user/files', {
      headers: {
        'Authorization': process.env.ZIPLINE_TOKEN
      },
    });
    if (!resGet.ok) {
      logger.error('Failed to get images with status code ' + resGet.status);
      return NextResponse.json({error: 'Failed to get images'}, {status: 500});
    }
    const data = await resGet.json();
    const image = data.find((image: {name: string, id: string}) => image.name === fileName);
    if (!image) return NextResponse.json({error: 'Failed to get image id'}, {status: 500});

    const reqBody = JSON.stringify({id: parseInt(image.id, 10)});
    // then delete the image
    const resDelete = await fetch(process.env.ZIPLINE_URL + '/api/user/files', {
      method: 'DELETE',
      headers: {
        'Authorization': process.env.ZIPLINE_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: reqBody
    });

    if (!resDelete.ok) {
      logger.error('Failed to delete image with status code ' + resDelete.status + ' and body ' + (await resDelete.json()));
      return NextResponse.json({error: 'Failed to delete image'}, {status: 500});
    }

    await prisma.galleryItem.delete({where: {id}});
    return NextResponse.json({success: 'Item deleted'});
  } catch (e) {
    logger.error(e);
    return NextResponse.json({error: 'Failed to delete item'}, {status: 500});
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) : Promise<NextResponse> {
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
      const hasAccess = await checkAccess(key, 'gallery.update');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const id = (await props.params).id;
  const item = await prisma.galleryItem.findUnique({where: {id}});
  if (!item) return NextResponse.json({error: 'Item not found'}, {status: 404});

  const formData = await req.formData();

  const title = formData.get('title') as string | null;
  const author = formData.get('author') as string | null;
  const description = formData.get('description') as string | null;
  const rank = formData.get('rank') as string | null;
  const builder = formData.get('builder') as string | null;
  const coords_x = formData.get('coords_x') as string | null;
  const coords_y = formData.get('coords_y') as string | null;
  const coords_z = formData.get('coords_z') as string | null;
  const coords_dimension = formData.get('coords_dimension') as 'overworld' | "nether" | "end" | null;


  const updateData: {title?: string, author?: string, description?: string, imagePath?: string, rank?: number, builder?: string, coords?: object} = {};
  if (title) updateData.title = title;
  if (author) updateData.author = author;
  if (description) updateData.description = description;
  if (rank) updateData.rank = parseInt(rank);
  if (builder) updateData.builder = builder;
  // GalleryCoords
  if (coords_x && coords_y && coords_z && coords_dimension) {
    updateData.coords = {
      x: parseFloat(coords_x),
      y: parseFloat(coords_y),
      z: parseFloat(coords_z),
      dimension: coords_dimension
    };
  }

  try {
    await prisma.galleryItem.update({where: {id}, data: updateData});
    return NextResponse.json({success: 'Item updated'});
  } catch (e) {
    logger.error(e);
    return NextResponse.json({error: 'Failed to update item'}, {status: 500});
  }
}