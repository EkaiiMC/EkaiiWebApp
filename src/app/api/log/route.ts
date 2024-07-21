import {NextRequest, NextResponse} from "next/server";
import {logger} from "@/logger";
import {generateApiKey} from "@/api-auth";

export async function GET(req: NextRequest) {
  console.log(req.headers.get('user-agent'))
  console.log(req.headers.get('X-Forwarded-For'))

  console.log(await generateApiKey('testApiAccess', {keys: {create: true, update: true, delete: true}}))
  return NextResponse.json({message: 'Hello World'});
}