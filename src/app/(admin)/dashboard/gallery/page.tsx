import GalleryManager from "@/components/gallery-manager";
import {auth} from "@/auth";
import {isDesignerOrMore, isWhitelisterOrMore} from "@/api-auth";
import {User} from "@auth/core/types";
import {redirect} from "next/navigation";

export default async function GalleryPage() {
  const session = await auth();

  if (!session || !session.user || !isDesignerOrMore((session.user as User & { role: string }).role)) {
    return redirect('/dashboard');
  }

  return (
    <div className={'flex h-full text-lg'}>
      <GalleryManager />
    </div>
  );


}