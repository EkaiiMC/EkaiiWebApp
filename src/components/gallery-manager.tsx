"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Picture {
  id: string;
  title: string;
  description?: string;
  imagePath: string;
  author: string;
  rank: string;
}

const ItemType = "PICTURE";

const DraggablePicture = ({ picture, index, movePicture, openModal, endDrag }: { picture: Picture, index: number, movePicture: (dragIndex: number, hoverIndex: number) => void, openModal: (type: "add" | "edit" | "delete", picture?: Picture) => void, endDrag: () => void }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
    end: endDrag,
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        movePicture(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => { ref(drop(node)); }} className="bg-bgLighterGray p-2 border-bgDarkGray border-2 m-2 w-auto h-auto flex flex-col justify-between">
      <div>
        <p>#{picture.rank}</p>
        <Image src={picture.imagePath} alt={picture.title} width={320} height={320} />
        <p>{picture.title}</p>
      </div>
      <div className="flex justify-between">
        <button onClick={() => openModal("edit", picture)} className="bg-blue-500 hover:bg-blue-700 transition-colors duration-300 px-2 py-1">Modifier</button>
        <button onClick={() => openModal("delete", picture)} className="bg-redText hover:bg-red-600 transition-colors duration-300 px-2 py-1">Supprimer</button>
      </div>
    </div>
  );
};

const Modal = ({ modalType, currentPicture, newPicture, handleInputChange, handleSubmit, handleDelete, handleEditSubmit, setIsModalOpen, loading }: any) => {
  const renderModalContent = () => (
    <form onSubmit={modalType === "add" ? handleSubmit : modalType === 'delete' ? handleDelete : handleEditSubmit} className="text-black flex flex-col flex-wrap min-w-80">
      {modalType !== "delete" && (
        <>
          {modalType === "add" && (
            <input
              type="file"
              name="file"
              onChange={handleInputChange}
              required
              className="mb-2 text-baseText bg-bgLighterGray"
            />
          )}
          <input
            type="text"
            name="title"
            placeholder="Titre"
            value={modalType === "add" ? newPicture.title : currentPicture?.title || ""}
            onChange={handleInputChange}
            required
            className="mb-2 px-1"
          />
          <input
            type="text"
            name="author"
            placeholder="Auteur"
            value={modalType === "add" ? newPicture.author : currentPicture?.author || ""}
            onChange={handleInputChange}
            required
            className="mb-2 px-1"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={modalType === "add" ? newPicture.description : currentPicture?.description || ""}
            onChange={handleInputChange}
            className="mb-2 h-32 px-1"
          />
        </>
      )}
      {modalType === "delete" && <p className="text-baseText">Êtes-vous sûr de vouloir supprimer cette image ?</p>}
      <div className="flex justify-between w-full mt-4 text-baseText">
        <button className="text-lg bg-redText hover:bg-red-600 px-2 py-1 transition-colors duration-300" onClick={() => setIsModalOpen(false)}>
          Annuler
        </button>
        <button type="submit" className="px-2 py-1 bg-greenText hover:bg-green-600 transition-colors duration-300">
          {loading ? "Loading..." : (modalType === "delete" ? "Supprimer" : "Confirmer")}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
         onClick={() => setIsModalOpen(false)}>
      <div className="bg-bgLightGray p-5 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl">{modalType === "add" ? "Ajouter une image" : modalType === "edit" ? "Modifier l'image" : "Confirmer la suppression"}</h2>
        </div>
        {renderModalContent()}
      </div>
    </div>
  );
};

export default function GalleryManager() {
  const [gallery, setGallery] = useState<Picture[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
  const [currentPicture, setCurrentPicture] = useState<Picture | null>(null);
  const [newPicture, setNewPicture] = useState<{ file: File | null; title: string; author: string; description: string; }>({ file: null, title: "", author: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await fetch("/api/gallery");
    const data = await res.json();
    setGallery(data.sort((a: Picture, b: Picture) => parseInt(a.rank) - parseInt(b.rank)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setNewPicture((prev) => ({ ...prev, file: files[0] }));
    } else {
      if (modalType === "add") {
        setNewPicture((prev) => ({ ...prev, [name]: value }));
      } else if (modalType === "edit" && currentPicture) {
        setCurrentPicture((prev) => ({ ...prev, [name]: value } as Picture));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    const formData = new FormData();
    if (newPicture.file) formData.append("file", newPicture.file);
    formData.append("title", newPicture.title);
    formData.append("author", newPicture.author);
    formData.append("description", newPicture.description);

    try {
      const response = await fetch("/api/gallery", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to create new picture");
      await fetchGallery();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating new picture:", error);
    } finally {
      setLoading(false); // Set loading to false when request ends
    }
  };

  const handleDelete = async () => {
    if (!currentPicture) return;
    setLoading(true); // Set loading to true when request starts
    try {
      const response = await fetch(`/api/gallery/${currentPicture.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete picture");
      await fetchGallery();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting picture:", error);
    } finally {
      setLoading(false); // Set loading to false when request ends
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPicture) return;
    setLoading(true); // Set loading to true when request starts
    const formData = new FormData();
    formData.append("title", currentPicture?.title || "");
    formData.append("author", currentPicture?.author || "");
    formData.append("description", currentPicture?.description || "");

    try {
      const response = await fetch(`/api/gallery/${currentPicture.id}`, { method: "PATCH", body: formData });
      if (!response.ok) throw new Error("Failed to update picture");
      await fetchGallery();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating picture:", error);
    } finally {
      setLoading(false); // Set loading to false when request ends
    }
  };

  const openModal = (type: "add" | "edit" | "delete", picture?: Picture) => {
    setModalType(type);
    setCurrentPicture(picture || null);
    setIsModalOpen(true);
  };

  const movePicture = (dragIndex: number, hoverIndex: number) => {
    const updatedGallery = [...gallery];
    const [draggedPicture] = updatedGallery.splice(dragIndex, 1);
    updatedGallery.splice(hoverIndex, 0, draggedPicture);
    setGallery(updatedGallery.map((picture, index) => ({ ...picture, rank: (index + 1).toString() })));
  };

  const endDrag = () => {
    updateRanks(gallery);
  };

  const updateRanks = async (updatedGallery: Picture[]) => {
    try {
      const response = await fetch("/api/gallery/update-ranks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGallery.map((picture) => ({ id: picture.id, rank: picture.rank }))),
      });
      if (!response.ok) throw new Error("Failed to update ranks");
    } catch (error) {
      console.error("Error updating ranks:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="m-4 bg-bgLighterGray overflow-auto flex-grow p-3 text-lg h-full max-h-[95vh]">
        <div className="flex justify-between">
          <h2 className="text-7xl font-bold">Galerie</h2>
          <button onClick={() => openModal("add")} className="bg-greenText h-10 p-2 hover:bg-green-600 transition-colors duration-300">Ajouter une image</button>
        </div>
        <div className="flex flex-wrap bg-bgGray p-3 overflow-y-scroll overflow-auto">
          {gallery.length > 0 && gallery.map((picture, index) => (
            <DraggablePicture key={picture.id} picture={picture} index={index} movePicture={movePicture} openModal={openModal} endDrag={endDrag} />
          ))}
          {gallery.length === 0 && <p className={'italic text-redText'}>Aucune image n&apos;a été ajoutée.</p>}
        </div>
        {isModalOpen && (
          <Modal
            modalType={modalType}
            currentPicture={currentPicture}
            newPicture={newPicture}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
            handleEditSubmit={handleEditSubmit}
            setIsModalOpen={setIsModalOpen}
            loading={loading}
          />
        )}
      </div>
    </DndProvider>
  );
}