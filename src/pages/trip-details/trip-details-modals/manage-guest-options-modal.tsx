import React, { useState, FormEvent } from "react";
import { Button } from "../../components/button";
import { X } from "lucide-react";
import { ManageGuestInviteModal } from "./manage-guests-invite-modal";
import { ManageGuestRemoveModal } from "./manage-guests-remove-modal"; 

import { useParams } from "react-router-dom";
import { api } from "../../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface manageGuestOptionsModalProps {
  closeManageGuestOptionsModal: () => void;
}

export function ManageGuestOptionsModal({
  closeManageGuestOptionsModal,
}: Readonly<manageGuestOptionsModalProps>) {
  const { tripId } = useParams(); // Pega o tripId dos parâmetros da URL
  const [isManageGuestInviteModalOpen, setIsManageGuestInviteModalOpen] = useState(false);
  const [isManageGuestRemoveModalOpen, setIsManageGuestRemoveModalOpen] = useState(false);
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  function openManageGuestInviteModal() {
    setIsManageGuestInviteModalOpen(true);
  }

  function closeManageGuestInviteModal() {
    setIsManageGuestInviteModalOpen(false);
  }

  function openManageGuestRemoveModal() {
    setIsManageGuestRemoveModalOpen(true);
  }

  function closeManageGuestRemoveModal() {
    setIsManageGuestRemoveModalOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    if (email && !emailsToInvite.includes(email)) {
      setEmailsToInvite([...emailsToInvite, email]);
      form.reset();
    }
  }

  function removeEmailFromInvites(email: string) {
    setEmailsToInvite(emailsToInvite.filter((e) => e !== email));
  }

  async function confirmInvites() {
    if (emailsToInvite.length === 0) {
      toast.error("Você precisa convidar pelo menos um e-mail antes de confirmar.");
      return;
    }
    try {
      await Promise.all(
        emailsToInvite.map(email =>
          api.post(`/trips/${tripId}/invites`, { email }) // Usa o tripId aqui
        )
      );
      toast.success('Convites enviados com sucesso!');
      closeManageGuestInviteModal();
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      toast.error('Erro ao enviar convites. Tente novamente.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[400px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Gerenciar convidados</h2>
          <button onClick={closeManageGuestOptionsModal}>
            <X className="size-5 text-zinc-400" />
          </button>
        </div>
        <p className="text-sm text-zinc-400">O que deseja fazer?</p>
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            size="full"
            onClick={openManageGuestRemoveModal}
          >
            Remover
          </Button>
          <Button
            variant="primary"
            size="full"
            onClick={openManageGuestInviteModal}
          >
            Convidar
          </Button>
        </div>
      </div>

      {isManageGuestInviteModalOpen && (
        <ManageGuestInviteModal
          closeManageGuestInviteModal={closeManageGuestInviteModal}
          emailsToInvite={emailsToInvite}
          addNewEmailToInvite={addNewEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
          confirmInvites={confirmInvites}
        />
      )}

      {isManageGuestRemoveModalOpen && (
        <ManageGuestRemoveModal
          closeManageGuestRemoveModal={closeManageGuestRemoveModal}
        />
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss={false}
        style={{ top: "20px" }}
      />
    </div>
  );
}
