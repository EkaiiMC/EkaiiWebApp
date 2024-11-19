import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/auth";
import {checkAccess, isDesignerOrMore} from "@/api-auth";
import prisma from "@/db";
import {logger} from "@/logger";
import {writeFile} from "fs/promises";

export async function DELETE(req: NextRequest, props: { params: { id: string } }) : Promise<NextResponse> {
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

  const id = props.params.id;
  const item = await prisma.galleryItem.findUnique({where: {id}});
  if (!item) return NextResponse.json({error: 'Item not found'}, {status: 404});

  try {
    await prisma.galleryItem.delete({where: {id}});
    return NextResponse.json({success: 'Item deleted'});
  } catch (e) {
    logger.error(e);
    return NextResponse.json({error: 'Failed to delete item'}, {status: 500});
  }
}

export async function PATCH(req: NextRequest, props: { params: { id: string } }) : Promise<NextResponse> {
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

  const id = props.params.id;
  const item = await prisma.galleryItem.findUnique({where: {id}});
  if (!item) return NextResponse.json({error: 'Item not found'}, {status: 404});

  const formData = await req.formData();

  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string | null;
  const author = formData.get('author') as string | null;
  const description = formData.get('description') as string | null;

  const updateData: {title?: string, author?: string, description?: string, imagePath?: string} = {};
  if (title) updateData.title = title;
  if (author) updateData.author = author;
  if (description) updateData.description = description;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.replaceAll(' ', '_');
    const filePath = `/uploads/${fileName}`;
    try {
      await writeFile('public'+filePath, buffer);
      updateData.imagePath = filePath;
    } catch (e) {
      logger.error(e);
      return NextResponse.json({error: 'Failed to upload file'}, {status: 500});
    }
  }

  try {
    await prisma.galleryItem.update({where: {id}, data: updateData});
    return NextResponse.json({success: 'Item updated'});
  } catch (e) {
    logger.error(e);
    return NextResponse.json({error: 'Failed to update item'}, {status: 500});
  }
}