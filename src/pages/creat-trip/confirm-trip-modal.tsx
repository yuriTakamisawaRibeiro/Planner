import { X, User, Mail } from "lucide-react";
import React, { FormEvent } from "react";
import { Button } from "../components/button";

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: (event: FormEvent<HTMLFormElement>) => void;
  setOwnerName: (name: string) => void;
  setOwnerEmail: (email: string) => void;
  destination: string;
  startDate: Date;
  endDate: Date;
  isLoading: boolean; 
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
  setOwnerName,
  setOwnerEmail,
  destination,
  startDate,
  endDate,
  isLoading, 
}: Readonly<ConfirmTripModalProps>) {
  const formattedStartDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(startDate);

  const formattedEndDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(endDate);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] max-h-[80vh] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 overflow-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Confirmar criação da viagem
            </h2>
            <button onClick={closeConfirmTripModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para{" "}
            <span className="text-zinc-100 font-semibold">
              {destination}
            </span>{" "}
            nas datas de{" "}
            <span className="text-zinc-100 font-semibold">
              {formattedStartDate} até {formattedEndDate}
            </span>{" "}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={createTrip} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <User className="text-zinc-400 size-5" />
            <input
              className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
              type="text"
              name="name"
              placeholder="Seu nome completo"
              onChange={event => setOwnerName(event.target.value)}
            />
          </div>

          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Mail className="text-zinc-400 size-5" />
            <input
              className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
              type="email"
              name="email"
              placeholder="Seu e-mail pessoal"
              onChange={event => setOwnerEmail(event.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" size="full" disabled={isLoading}>
            {isLoading ? "Carregando..." : "Confirmar criação da viagem"}
          </Button>
        </form>
      </div>
    </div>
  );
}
