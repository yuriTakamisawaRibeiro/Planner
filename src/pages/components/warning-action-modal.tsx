import React from "react";
import { Button } from "../components/button";

interface WarningActionModalProps {
  closeWarningActionModal: () => void;
  confirmAction: () => void;
  message: string;
}

export function WarningActionModal({
  closeWarningActionModal,
  confirmAction,
  message,
}: Readonly<WarningActionModalProps>) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[400px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Atenção</h2>
        </div>
        <p className="text-sm text-zinc-400">{message}</p>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" size="full" onClick={closeWarningActionModal}>
            Cancelar
          </Button>
          <Button variant="primary" size="full" onClick={confirmAction}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
