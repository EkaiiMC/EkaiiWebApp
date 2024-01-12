export enum Status {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
}

export async function getServerStatus() : Promise<Status> {
    let res = await fetch(process.env.SERVER_URL+"/api/server/status", {
        cache: "no-cache",
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch server status: ${res.statusText}`)
    }
    let json = await res.json();
    return json["isOnline"] ? Status.ONLINE : Status.OFFLINE;
}

export async function getPlayerCount() : Promise<number> {
    let res = await fetch(process.env.SERVER_URL+"/api/server/status", {
        cache: "no-cache",
    })
    if (!res.ok) {
        throw new Error(`Failed to fetch server status: ${res.statusText}`)
    }
    let json = await res.json();
    return json["onlinePlayers"];
}