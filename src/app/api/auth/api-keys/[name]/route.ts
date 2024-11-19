import {NextRequest, NextResponse} from "next/server";
import {
  ApiScope,
  checkAccess,
  deleteApiKey,
  editPermissions, getCreatedAt,
  getPermissions,
  isMaintainer,
} from "@/api-auth";
import {auth} from "@/auth";

export async function GET(req: NextRequest, props: {params: Promise<{name: string}>}) {
  const params = await props.params;
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
      const hasAccess = await checkAccess(key, 'keys.access');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  const perms = await getPermissions(params.name);
  const createdAt = await getCreatedAt(params.name);
  return NextResponse.json({name: params.name, scopes: perms, createdAt: createdAt}, {status: 200});
}

export async function PATCH(req: NextRequest, props: {params: Promise<{name: string}>}) {
  const params = await props.params;
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
      const hasAccess = await checkAccess(key, 'keys.update');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  let scope : ApiScope;
  try {
    const body = await req.json();
    scope = body.scopes as ApiScope;
  } catch (e) {
    return NextResponse.json({message: 'Invalid body'}, {status: 400});
  }
  try {
    const key = await editPermissions(params.name, scope);
    return NextResponse.json(key, {status: 200});
  } catch (e) {
    return NextResponse.json({message: 'Key not found'}, {status: 404});
  }
}

export async function DELETE(req: NextRequest, props: {params: Promise<{name: string}>}) {
  const params = await props.params;
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
      const hasAccess = await checkAccess(key, 'keys.delete');
      if (!hasAccess) {
        return NextResponse.json({message: 'Forbidden'}, {status: 403});
      }
    } catch (e) {
      return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
  }

  await deleteApiKey(params.name);

  return NextResponse.json({message: 'Key deleted'}, {status: 200});
}