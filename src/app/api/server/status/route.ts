import {NextRequest, NextResponse} from "next/server";
import {getServerStatus} from "@/utils";

export async function GET(req: NextRequest) {
  const res = await getServerStatus();
  return NextResponse.json(res);
}