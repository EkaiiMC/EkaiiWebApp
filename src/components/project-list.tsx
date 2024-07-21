import prisma from "@/db";
import {ReactNode} from "react";

function ProjectTableHead() {
  return (
    <thead>
      <tr>
        <th className={'text-center p-2 w-[60px]'}>Statut</th>
        <th className={'text-center p-2'}>Nom</th>
        <th className={'text-center p-2'}>Date de création</th>
        <th className={'text-center p-2'}>Créateur(s)</th>
      </tr>
    </thead>
  );
}

export function ProjectListSkeleton() {
  let elmt: ReactNode[] = [];
  for (let i = 0; i < 7; i++) {
    elmt.push(
      <div className={'flex justify-start align-center bg-bgDarkGray animate-pulse h-[100px] w-full mb-2'}/>
    );
  }

  return (
    <div>
      <table className={'overflow-y-scroll overflow-auto mt-4 w-full text-lg'}>
        <ProjectTableHead/>
      </table>
      {elmt}
    </div>

  )
}

function ProjectCard() {
  return (
    <div className={'flex justify-start align-center bg-bgDarkGray p-2 m-2 h-[100px]'}>
      <div className={'text-left flex flex-col ml-2 overflow-hidden'}>
        <p className={'text-2xl font-bold'}>Nom du projet</p>
        <p className={'text-lg'}>Description du projet</p>
      </div>
    </div>
  );
}

export async function ProjectList() {

  const projects = await prisma.project.findMany({include: {authors: true, tasks: {orderBy: {createdAt: 'desc'}}}});

  const isProjectEmpty = projects.length === 0;

  const formattedProject = projects.map(project => {
    const isProjectCompleted = project.tasks.every(task => task.status === 'DONE');
    const dateStr = new Date(project.createdAt).toDateString();
  })

  return (
    <table className={'overflow-y-scroll overflow-auto mt-4 w-full text-lg'}>
      <ProjectTableHead/>
      {projects.map(project => (
        <tr key={project.id}>
          <td className={'text-center p-2'}>{project.tasks.length}</td>
          <td className={'text-center p-2'}>{project.title}</td>
          <td className={'text-center p-2'}>{new Date(project.createdAt).toDateString()}</td>
          <td className={'text-center p-2'}>{project.authors[0].name}</td>
        </tr>
      ))}
    </table>
  )
}