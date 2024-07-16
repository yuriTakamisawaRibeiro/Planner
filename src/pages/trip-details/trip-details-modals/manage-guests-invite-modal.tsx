import React, { FormEvent, useState } from "react";
import { Button } from "../../components/button";
import { AtSign, Plus, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { api } from "../../../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface manageGuestInviteModalProps {
  closeManageGuestInviteModal: () => void;
  emailsToInvite: string[];
  addNewEmailToInvite: (event: FormEvent<HTMLFormElement>) => void;
  removeEmailFromInvites: (email: string) => void;
}

export function ManageGuestInviteModal({
  closeManageGuestInviteModal,
  emailsToInvite,
  addNewEmailToInvite,
  removeEmailFromInvites,
}: Readonly<manageGuestInviteModalProps>) {
  const { tripId } = useParams(); // Obtém tripId dos parâmetros da URL
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carregamento
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

  async function confirmInvites() {
    if (emailsToInvite.length === 0) {
      toast.error("Convide pelo menos um e-mail antes de confirmar.");
      return;
    }

    setIsLoading(true); // Inicia o carregamento

    try {
      await Promise.all(
        emailsToInvite.map(email => 
          api.post(`/trips/${tripId}/invites`, { email }) // Usa o tripId aqui
        )
      );
      toast.success("Convites enviados com sucesso!");
      setTimeout(() => {
        window.location.reload(); // Recarrega a página após um breve intervalo
      }, 1000);
    } catch (error) {
      console.error('Erro ao enviar convites:', error);
      setError('E-mails já participantes não podem ser convidados novamente.');
      toast.error("E-mails já participantes não podem ser convidados novamente.");
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] max-h-[80vh] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Adicionar participantes</h2>
          <button onClick={closeManageGuestInviteModal}>
            <X className="size-5 text-zinc-400" />
          </button>
        </div>
        <p className="text-sm text-zinc-400">
          Convide mais pessoas para sua viagem.
        </p>
        <div className="flex flex-wrap gap-2">
          {emailsToInvite.map((email) => (
            <div
              key={email}
              className="py-1.5 px-2.5 rounded-md bg-zinc-800 flex items-center gap-2"
            >
              <span className="text-zinc-300">{email}</span>
              <button type="button" onClick={() => removeEmailFromInvites(email)}>
                <X className="size-4 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-zinc-800"></div>

        <form
          onSubmit={addNewEmailToInvite}
          className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2"
        >
          <div className="px-2 flex items-center flex-1 gap-2">
            <AtSign className="text-zinc-400 size-5" />
            <input
              className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
              type="email"
              name="email"
              placeholder="Digite o e-mail do convidado"
            />
          </div>

          <Button type="submit" variant="primary">
            Convidar <Plus className="size-5" />
          </Button>
        </form>

        <Button
          variant="primary"
          size="full"
          onClick={confirmInvites}
          disabled={isLoading } // Desabilita o botão se não houver e-mails ou estiver carregando
        >
          {isLoading ? "...carregando" : "Confirmar"}
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
