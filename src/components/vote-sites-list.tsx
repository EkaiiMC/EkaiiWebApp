"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VoteSite {
  id: string;
  title: string;
  url: string;
}

const Modal = ({ modalType, currentSite, newSite, handleInputChange, handleSubmit, handleDelete, handleEditSubmit, setIsModalOpen }: any) => {
  const renderModalContent = () => (
    <form onSubmit={modalType === "add" ? handleSubmit : modalType === 'delete' ? handleDelete : handleEditSubmit} className="text-black flex flex-col flex-wrap min-w-80">
      {modalType !== "delete" && (
        <>
          <input
                type="text"
                name="title"
                placeholder={"Titre"}
                value={modalType === "add" ? newSite.title : currentSite?.title || ""}
                onChange={handleInputChange}
                required
                className="mb-2 px-1 text-black"
          />
          <input
                type="url"
                name="url"
                placeholder={"URL"}
                value={modalType === "add" ? newSite.url : currentSite?.url || ""}
                onChange={handleInputChange}
                required
                className="mb-2 px-1"
          />
        </>
      )}
      {modalType === "delete" && <p className="text-baseText">Êtes-vous sûr de vouloir supprimer ce site de vote ?</p>}
      <div className="flex justify-between w-full mt-4 text-baseText">
        <button className="text-lg bg-redText hover:bg-red-600 px-2 py-1 transition-colors duration-300" onClick={() => setIsModalOpen(false)}>
          Annuler
        </button>
        <button type="submit" className="px-2 py-1 bg-greenText hover:bg-green-600 transition-colors duration-300">
          {modalType === "delete" ? "Supprimer" : "Confirmer"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={() => setIsModalOpen(false)}>
      <div className="bg-bgLightGray p-5 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl">{modalType === "add" ? "Ajouter un site de vote" : modalType === "edit" ? "Modifier le site de vote" : "Confirmer la suppression"}</h2>
        </div>
        {renderModalContent()}
      </div>
    </div>
  );
};

export default function VoteSitesList() {
  const [sites, setSites] = useState<VoteSite[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
  const [currentSite, setCurrentSite] = useState<VoteSite | null>(null);
  const [newSite, setNewSite] = useState<{ title: string; url: string; }>({ title: "", url: "" });

  useEffect(() => {
    fetch('/api/vote/sites')
      .then(res => res.json())
      .then(setSites);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (modalType === "add") {
      setNewSite((prev) => ({ ...prev, [name]: value }));
    } else if (modalType === "edit" && currentSite) {
      setCurrentSite((prev) => ({ ...prev, [name]: value } as VoteSite));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/vote/sites', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSite),
    });
    const newSiteData = await response.json();
    setSites((prev) => [...prev, newSiteData]);
    setIsModalOpen(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSite) return;
    await fetch(`/api/vote/sites/${currentSite.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentSite),
    });
    setSites((prev) => prev.map((site) => (site.id === currentSite.id ? currentSite : site)));
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!currentSite) return;
    await fetch(`/api/vote/sites/${currentSite.id}`, { method: "DELETE" });
    setSites((prev) => prev.filter((site) => site.id !== currentSite.id));
    setIsModalOpen(false);
  };

  const openModal = (type: "add" | "edit" | "delete", site?: VoteSite) => {
    setModalType(type);
    setCurrentSite(site || null);
    setIsModalOpen(true);
  };

  return (
    <div className={'bg-bgLighterGray p-2 text-lg min-w-[350px]'}>
      <div className={'flex justify-between mb-4'}>
        <h1 className="text-3xl font-bold">Sites de vote</h1>
        <button onClick={() => openModal("add")} className={'bg-green-500 hover:bg-green-700 text-baseText px-2 py-1'}>Ajouter</button>
      </div>
      {sites.length === 0 && <p>Aucun site de vote n&apos;a été ajouté.</p>}
      {sites.length > 0 && (
        <div className={'grid grid-cols-1 min-[1100px]:grid-cols-2 gap-2 mt-1'}>
          {sites.map(site => (
            <div key={site.id} className={'bg-bgDarkGray p-2 flex justify-between min-w-[350px]'}>
              <div className={'my-auto'}>
                <h2 className={'text-2xl font-bold'}>{site.title}</h2>
                <p className={'text-lg'}>Lien : <Link href={site.url} target={'_blank'} className={'text-pinkText hover:underline'}>{site.url}</Link></p>
              </div>
              <div className={'flex flex-col my-auto'}>
                <button onClick={() => openModal("edit", site)} className={'bg-blue-500 hover:bg-blue-700 text-baseText px-2 py-1 m-1'}>Modifier</button>
                <button onClick={() => openModal("delete", site)} className={'bg-redText hover:bg-red-700 text-baseText px-2 py-1 m-1'}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <Modal
          modalType={modalType}
          currentSite={currentSite}
          newSite={newSite}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          handleEditSubmit={handleEditSubmit}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}