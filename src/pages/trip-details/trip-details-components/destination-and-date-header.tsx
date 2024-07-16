import { MapPin, Calendar, Settings2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { api } from "../../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UpdateDestinationAndDateModal } from "../trip-details-modals/update-destination-and-date-modal"; 
import { DateRange } from "react-day-picker";

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams<{ tripId: string }>();

  const [trip, setTrip] = useState<Trip | undefined>(undefined);

  const [isUpdateDestinationAndDateModalOpen, setIsUpdateDestinationAndDateModalOpen] = useState(false);

  const [eventStartAndEnd, setEventStartAndEnd] = useState<DateRange | undefined>(undefined);

  function openUpdateDestinationAndDateModal() {
    setIsUpdateDestinationAndDateModalOpen(true);
  }

  function closeUpdateDestinationAndDateModal() {
    setIsUpdateDestinationAndDateModalOpen(false);
  }

  useEffect(() => {
    if (!tripId) return;

    api.get(`/trips/${tripId}`)
      .then((response) => {
        if (response.status === 200 && response.data) {
          setTrip(response.data.trip);
          setEventStartAndEnd({
            from: new Date(response.data.trip.starts_at),
            to: new Date(response.data.trip.ends_at)
          });
        } else {
          console.error("Erro ao buscar viagem:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar viagem:", error.message);
      });
  }, [tripId]);

  const displayedDate = trip
    ? `${format(new Date(trip.starts_at), "d 'de' LLL", { locale: ptBR })} até ${format(new Date(trip.ends_at), "d 'de' LLL", { locale: ptBR })}`
    : null;

  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination || 'Carregando...'}</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400 " />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className="w-px h-6 bg-zinc-800"></div>

        <Button onClick={openUpdateDestinationAndDateModal} variant="secondary">
          Alterar local/data
          <Settings2 className="size-5" />
        </Button>
      </div>

      {isUpdateDestinationAndDateModalOpen && (
        <UpdateDestinationAndDateModal 
          closeUpdateDestinationAndDateModal={closeUpdateDestinationAndDateModal}
          setEventStartAndEnd={setEventStartAndEnd}
          eventStartAndEnd={eventStartAndEnd}
          trip={trip} // Passa a viagem para o modal
        />
      )}
    </div>
  );
}
