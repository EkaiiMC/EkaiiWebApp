import prisma from "@/db";

interface LeaderboardEntry {
  userId: string;
  username: string;
  voteCount: number;
  rank: number;
}

export default async function Leaderboard({ type }: { type: "monthly" | "global" }) {

  const leaderboard = type === "monthly" ? await prisma.monthlyLeaderboard.findMany() : await prisma.leaderboard.findMany()

  return (
    <div className={'text-lg bg-bgLighterGray p-2 flex-grow'}>
      <h1 className={'text-4xl font-bold text-center mb-3'}>Leaderboard {type === "monthly" ? "Mensuel" : "Global"}</h1>
      <div className={'overflow-y-auto'}>
        <table className={'w-full'}>
          <thead className={'text-left'}>
          <tr>
            <th className={'p-2'}>Rang</th>
            <th className={'p-2'}>Pseudo</th>
            <th className={'p-2'}>Votes</th>
          </tr>
          </thead>
          <tbody>
          {leaderboard.map((entry) => (
            <tr key={entry.userId} className={'bg-bgLightGray p-2 border-transparent border-b-bgDarkGray border-2'}>
              <td className={'p-2'}>{entry.rank}</td>
              <td className={'p-2'}>{entry.username}</td>
              <td className={'p-2'}>{entry.voteCount}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}