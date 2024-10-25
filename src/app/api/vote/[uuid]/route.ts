import {NextRequest, NextResponse} from "next/server";
import prisma from "@/db";

export async function GET(req: NextRequest, props: {params: Promise<{uuid: string}>}) {
  const params = await props.params;
  const site = await prisma.voteSite.findFirst({where: {id: params.uuid}});
  if(!site) {
    return NextResponse.json({message: 'Site not found'}, {status: 404});
  }

  const userIp = req.headers.get('x-client-ip') ?? req.headers.get('x-forwarded-for');
  console.log(userIp);
  const tokenServeurPrive = process.env.TOKEN_SERVEUR_PRIVE;

  switch(site.title) {
    case "serveur-prive.net":
      const request = await fetch(`https://serveur-prive.net/api/v1/servers/${tokenServeurPrive}/votes/${userIp}`);
      const res: {success: boolean, data: any} = await request.json();
      if (res.success) {
        return NextResponse.json({message: 'Vote pris en compte'});
      } else {
        return NextResponse.json({message: 'Vous n\'avez pas voté sur ce site'}, {status: 400});
      }
    default:
      return NextResponse.json({message: 'Site non supporté'}, {status: 400});
  }
}