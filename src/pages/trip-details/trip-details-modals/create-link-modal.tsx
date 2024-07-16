import { X, Tag, Link2 } from "lucide-react";
import React, { FormEvent } from "react";
import { Button } from "../../components/button"; 
import { useParams } from "react-router-dom";
import { api } from "../../../lib/axios";

interface createLinkModalProps {
  closeLinkModal: () => void;
}

export function CreateLinkModal({
  closeLinkModal,
}: Readonly<createLinkModalProps>) {
  const { tripId } = useParams();

  function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const title = data.get("title")?.toString();
    const url = data.get("url")?.toString();

    api.post(`/trips/${tripId}/links`, {
      title,
      url,
    });

    window.document.location.reload();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="w-[640px] max-h-[80vh] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 overflow-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Criar link</h2>
            <button>
              <X className="size-5 text-zinc-400" onClick={closeLinkModal} />
            </button>
          </div>
          <p className="text-sm text-zinc-400 ">
            Todos convidados podem visualizar os links importantes.
          </p>
        </div>

        <form onSubmit={createLink} className="space-y-3">
          <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
            <Tag className="text-zinc-400 size-5" />
            <input
              className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
              type="text"
              name="title"
              placeholder="Qual o titulo do link?"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-14 flex-1 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Link2 className="text-zinc-400 size-5" />
              <input
                className="bg-transparent text-lg placeholder-zinc-400 flex-1 outline-none"
                type="url"
                name="url"
                placeholder="Qual é a url do link?"
              />
            </div>
          </div>

          <Button variant="primary" size="full">
            Salvar link
          </Button>
        </form>
      </div>
    </div>
  );
}
