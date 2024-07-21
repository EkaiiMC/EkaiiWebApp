"use client"


export default function ProjectHeader(){
  return (
    <div className={'flex justify-between'}>
      <h1 className="text-7xl font-bold">Projets</h1>
      <button onClick={() => {
        document.getElementById('project-modal')!.style.display = 'block';
      }} className={'bg-pinkText hover:bg-darkPink text-lg p-2 h-1/2 mt-2 mr-2'}>Nouveau projet
      </button>
    </div>
  )
}