import {NextResponse} from "next/server";
import {getServerStatus} from "@/utils";

export const dynamic = 'force-dynamic';

export async function GET() {
  const res = await getServerStatus();
  return NextResponse.json(res);
}