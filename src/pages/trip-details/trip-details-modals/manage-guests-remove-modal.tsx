import React, { useState, useEffect } from "react";
import { Button } from "../../components/button";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { api } from "../../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface manageGuestRemoveModalProps {
  closeManageGuestRemoveModal: () => void;
}

interface Participant {
  id: string;
  name: string | null;
  email: string;
  is_confirmed: boolean;
}

export function ManageGuestRemoveModal({
  closeManageGuestRemoveModal,
}: Readonly<manageGuestRemoveModalProps>) {
  const { tripId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get(`trips/${tripId}/participants`)
      .then(response => {
        // Removendo o primeiro participante (criador da viagem)
        const participants = response.data.participants;
        if (participants.length > 0) {
          setParticipants(participants.slice(1));
        }
      })
      .catch(error => {
        console.error('Erro ao buscar participantes:', error);
        toast.error('Erro ao buscar participantes. Tente novamente.');
      });
  }, [tripId]);

  function toggleSelectEmail(email: string) {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(e => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  }

  async function removeSelectedGuests() {
    if (selectedEmails.length === 0) {
      toast.error("Você precisa selecionar pelo menos um convidado para remover.");
      return;
    }

    setIsLoading(true);

    try {
      await Promise.all(
        selectedEmails.map(email =>
          api.delete(`/trips/${tripId}/participants`, { data: { email } })
        )
      );
      toast.success("Convidados removidos com sucesso!");
      setParticipants(participants.filter(participant => !selectedEmails.includes(participant.email)));
      setSelectedEmails([]);
    } catch (error) {
      console.error('Erro ao remover convidados:', error);
      toast.error('Erro ao remover convidados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleCloseModal = () => {
    closeManageGuestRemoveModal();
    window.location.reload(); // Reiniciar a página ao fechar o modal
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] max-h-[80vh] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Remover convidados</h2>
          <button onClick={handleCloseModal}>
            <X className="size-5 text-zinc-400" />
          </button>
        </div>
        <p className="text-sm text-zinc-400">Selecione os convidados que deseja remover.</p>
        
        {participants.length === 0 ? (
          <p className="text-sm text-zinc-400">Não há convidados para remover.</p>
        ) : (
          <div className="space-y-5 max-h-[50vh] overflow-y-auto">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="block font-medium text-zinc-100">{participant.name || `Convidado`}</span>
                  <span className="block text-sm text-zinc-400 truncate">{participant.email}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(participant.email)}
                  onChange={() => toggleSelectEmail(participant.email)}
                  className="form-checkbox text-zinc-400"
                />
              </div>
            ))}
          </div>
        )}

        <Button
          variant="primary"
          size="full"
          onClick={removeSelectedGuests}
          disabled={isLoading || participants.length === 0}
        >
          {isLoading ? "...carregando" : "Remover selecionados"}
        </Button>
      </div>

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
