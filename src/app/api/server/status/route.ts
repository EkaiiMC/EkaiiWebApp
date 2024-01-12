import {NextResponse} from "next/server";
import {headers} from "next/headers";

export async function GET(req: Request) {

    try {
        let res = await fetch(process.env.API_URL! + '/server/ping',
            {
                method: "GET",
                cache: "no-cache",
                headers: {
                    Authorization: "Bearer " + process.env.API_KEY!,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
        return NextResponse.json(await res.json(), {status: res.status});
    } catch (err) {
        return NextResponse.json({
                status: '200',
                statusText: 'OK',
                isOnline: false,
                onlinePlayers: 0,
                maxPlayers: 0,
            },
            {status: 200});
    }
}