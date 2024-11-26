import {NextRequest, NextResponse} from "next/server";
import prisma from "@/db";
import ExpiryMap from "expiry-map";
import {auth} from "@/auth";
import {getVotingDelta} from "@/utils";

export const dynamic = 'force-dynamic';

const rateLimits : {[key : string]: ExpiryMap} = {
  'serveur-prive.net': new ExpiryMap(5000),
  'serveur-minecraft-vote.fr': new ExpiryMap(5000),
}

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(', ')[0] || req.ip;

  // Rate limiting
  if (rateLimits[params.name] && rateLimits[params.name].has(ip)) {
    return NextResponse.json({message: 'Rate limit exceeded'}, {status: 429});
  }

  rateLimits[params.name]?.set(ip, true);

  const user = await auth();

  if (!user || !user.user || !user.user.id) {
    return NextResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  const userId = user.user.id;
  let voteStatus: { hasVoted: boolean, nextVote?: Date, lastVote?: Date } = { hasVoted: false, lastVote: undefined, nextVote: undefined };
  const site = await prisma.voteSite.findFirst({
    where: {
      title: params.name
    }
  });

  if (!site) {
    return NextResponse.json({message: 'Invalid site'}, {status: 400});
  }

  // check last vote from user
  const lastVote = await prisma.vote.findFirst({
    where: {
      siteId: site.id,
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const delta = getVotingDelta(site.title);

  // if vote is too soon, no need to check through API
  if (lastVote && lastVote.createdAt.getTime() + delta.getTime() > Date.now()) {
    voteStatus = {
      hasVoted: true,
      nextVote: new Date(lastVote.createdAt.getTime() + delta.getTime()),
      lastVote: lastVote.createdAt
    };
    return NextResponse.json(voteStatus);
  }

  // check through API
  switch (site.title) {
    case 'serveur-prive.net':
      const res = await fetch(`https://serveur-prive.net/api/v1/servers/${process.env.TOKEN_SERVEUR_PRIVE}/votes/${ip}`);
      const json: {
        success: boolean,
        data?: { username: string, voted_at: number, next_vote_seconds: number }
      } = await res.json();
      if (!json.success) { // User has not voted
        voteStatus = {hasVoted: false, lastVote: lastVote?.createdAt};
      } else {
        voteStatus = {
          hasVoted: true,
          nextVote: new Date(json.data!.voted_at * 1000 + json.data!.next_vote_seconds * 1000),
          lastVote: new Date(json.data!.voted_at * 1000)
        };
      }
      break;
    case 'serveur-minecraft-vote.fr':
      const res2 = await fetch(`https://serveur-minecraft-vote.fr/api/v1/servers/${process.env.SERVEUR_MINECRAFT_VOTE_SERVER_ID}/vote/${ip}`);
      const json2: {
        canVote: boolean,
        waitSecond?: number,
        name?: string,
        votedAt?: string // ISO 8601 format
      } = await res2.json();
      if (json2.canVote) { // User has not voted
        voteStatus = {hasVoted: false, lastVote: lastVote?.createdAt};
      } else {
        voteStatus = {
          hasVoted: true,
          nextVote: new Date(Date.parse(json2.votedAt!) + json2.waitSecond! * 1000),
          lastVote: new Date(Date.parse(json2.votedAt!))
        };
      }
      break;
    default:
      return NextResponse.json({message: 'Invalid site'}, { status: 400 });
  }

  // register vote in db if API's lastVote is different from what was found in db
  if (voteStatus.hasVoted && (!lastVote || lastVote.createdAt.getTime() !== voteStatus.lastVote?.getTime())) {
    await prisma.vote.create({
      data: {
        siteId: site.id,
        userId: userId,
        createdAt: voteStatus.lastVote!
      }
    });
  }

  return NextResponse.json(voteStatus);
}