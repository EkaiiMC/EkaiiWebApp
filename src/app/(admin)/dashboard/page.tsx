import {auth} from "@/auth";
import DashboardContent from "@/components/dashboard-content";

export default async function DashboardHome() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const startMessage = (() => {
    const date = new Date();
    const hour = date.getHours();
    if (hour < 18) {
      return "Bonjour";
    } else {
      return "Bonsoir";
    }
  })()

  return (
    <div className={'m-4 text-lg h-4/5'}>
      <h1 className="text-5xl font-bold">{startMessage}, {session.user.name!}.</h1>
      <DashboardContent />
    </div>
  );
}