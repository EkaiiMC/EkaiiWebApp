"use client";

export function CloseButton() {
  return (
    <button onClick={() => {
      document.getElementById('project-modal')!.style.display = 'none';
    }} className={'bg-pinkText hover:bg-darkPink text-lg p-2 h-1/2 mt-2 mr-2'}>Fermer
    </button>
  )
}