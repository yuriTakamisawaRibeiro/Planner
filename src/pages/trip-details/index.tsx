import { Plus, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { CreateActivityModal } from "./trip-details-modals/create-activty-modal"; 
import { ImportantLinks } from "./trip-details-components/important-links"; 
import { Guests } from "./trip-details-components/guests"; 
import { Activities } from "./trip-details-components/activities"; 
import { DestinationAndDateHeader } from "./trip-details-components/destination-and-date-header";
import { Button } from "../components/button";

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] =
    useState(false);

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true);
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false);
  }

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader />

      <main className="flex gap-16 px-4  ">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between ">
            <h2 className="text-3xl font-semibold">Atividades</h2>
            <button
              onClick={openCreateActivityModal}
              className="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 font-medium flex items-center gap-2 hover:bg-lime-400 transition"
            >
              <Plus className="size-5" />
              Cadastrar atividade
            </button>
          </div>

          <Activities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks />

          <div className="w-full h-px bg-zinc-800"></div>

          <Guests />


          
        </div>
      </main>

      {isCreateActivityModalOpen && (
        <CreateActivityModal closeActivityModal={closeCreateActivityModal} />
      )}
    </div>
  );
}
