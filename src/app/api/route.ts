import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({status: 200, body: {api_version : "1.0.0", online : true}});

}