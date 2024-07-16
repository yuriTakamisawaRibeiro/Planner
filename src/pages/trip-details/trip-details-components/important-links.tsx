import { Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button"; 
import { useParams } from "react-router-dom";
import { api } from "../../../lib/axios";
import { CreateLinkModal } from "../trip-details-modals/create-link-modal"; 
import { WarningActionModal } from "../../components/warning-action-modal";

interface Link {
  id: string;
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams();
  const [links, setLinks] = useState<Link[]>([]);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [isWarningActionModalOpen, setIsWarningActionModalOpen] =
    useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/trips/${tripId}/links`)
      .then((response) => setLinks(response.data.links));
  }, [tripId]);

  function openCreateLinkModal() {
    setIsCreateLinkModalOpen(true);
  }

  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false);
  }

  function openWarningActionModal(linkId: string) {
    setLinkToDelete(linkId);
    setIsWarningActionModalOpen(true);
  }

  function closeWarningActionModal() {
    setIsWarningActionModalOpen(false);
    setLinkToDelete(null);
  }

  async function deleteLink() {
    if (!linkToDelete) return;

    try {
      await api.delete(`/links/${linkToDelete}`);
      setLinks(links.filter((link) => link.id !== linkToDelete));
      closeWarningActionModal();
    } catch (error) {
      console.error("Erro ao deletar o link:", error);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Links importantes</h2>

      <div className="space-y-5">
        {links.length > 0 ? (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className="block font-medium text-zinc-100">
                  {link.title}
                </span>
                <a
                  href={link.url}
                  className="block text-sm text-zinc-400 truncate hover:text-zinc-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.url}
                </a>
              </div>
              <Trash2
                onClick={() => openWarningActionModal(link.id)}
                className="text-zinc-400 size-5 shrink-0 cursor-pointer"
              />
            </div>
          ))
        ) : (
          <p className="text-zinc-500 text-sm">Nenhum link cadastrado.</p>
        )}
      </div>

      <Button onClick={openCreateLinkModal} variant="secondary" size="full">
        <Plus className="size-5" />
        Criar novo link
      </Button>

      {isCreateLinkModalOpen && (
        <CreateLinkModal closeLinkModal={closeCreateLinkModal} />
      )}

      {isWarningActionModalOpen && (
        <WarningActionModal
          closeWarningActionModal={closeWarningActionModal}
          confirmAction={deleteLink}
          message="Tem certeza que quer deletar este link?"
        />
      )}
    </div>
  );
}
