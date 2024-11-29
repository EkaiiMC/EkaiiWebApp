import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {isDesignerOrMore} from "@/api-auth";
import {User} from "@auth/core/types";
import {ProjectList, ProjectListSkeleton} from "@/components/project-list";
import {Suspense} from "react";
import ProjectHeader from "@/components/project-header";
import {CloseButton} from "@/components/modals";

export default async function ProjectsPage() {

  const session = await auth();

  if (!session || !session.user || !isDesignerOrMore((session.user as User & { role: string }).role)) {
    return redirect('/dashboard');
  }

  "use client";
  return (
    <div className={'m-4 p-2 bg-bgLighterGray h-[95vh] overflow-y-scroll overflow-auto'}>
      <ProjectHeader/>
      <Suspense fallback={<ProjectListSkeleton/>}>
        <ProjectList/>
      </Suspense>
      <dialog id={'project-modal'} className={'hidden absolute w-full h-full top-0 left-0 bg-transparent'}>
        <div className={'blur-md absolute h-full w-full top-0 left-0 bg-transparent'}/>
        <div className={'z-50'}>
          <CloseButton/>
        </div>

      </dialog>
    </div>
  );
}