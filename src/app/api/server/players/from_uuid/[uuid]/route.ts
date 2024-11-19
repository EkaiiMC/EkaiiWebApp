import {NextRequest, NextResponse} from "next/server";
import {getPlayerUsernameFromUUID, removeDashes} from "@/mc-utils";

export async function GET(req: NextRequest, props: {params: Promise<{uuid: string}>}) {
  const uuid = (await props.params).uuid;
  const playerUuid = removeDashes(uuid);
  const player = await getPlayerUsernameFromUUID(playerUuid);
  return player ? NextResponse.json({player}) : NextResponse.json({message: 'Player not found'}, {status: 404});
}