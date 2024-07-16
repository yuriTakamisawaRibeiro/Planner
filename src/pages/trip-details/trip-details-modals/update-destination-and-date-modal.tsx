import { X, Calendar, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/axios";
import { ptBR } from "date-fns/locale";
import { DateRange, DayPicker } from "react-day-picker";
import { format, isValid } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

interface UpdateDestinationAndDateModalProps {
  closeUpdateDestinationAndDateModal: () => void;
  setEventStartAndEnd: (dates: DateRange | undefined) => void;
  eventStartAndEnd: DateRange | undefined;
  trip: Trip | undefined;
}

export function UpdateDestinationAndDateModal({
  closeUpdateDestinationAndDateModal,
  setEventStartAndEnd,
  eventStartAndEnd,
  trip,
}: Readonly<UpdateDestinationAndDateModalProps>) {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [destination, setDestination] = useState(trip?.destination || "");
  const [initialDateRange, setInitialDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (trip) {
      const startDate = new Date(trip.starts_at);
      const endDate = new Date(trip.ends_at);
      if (isValid(startDate) && isValid(endDate)) {
        setInitialDateRange({
          from: startDate,
          to: endDate,
        });
        setEventStartAndEnd({
          from: startDate,
          to: endDate,
        });
      }
      setDestination(trip.destination);
    }
  }, [trip, setEventStartAndEnd]);

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }

  const formattedStartDate =
    eventStartAndEnd?.from instanceof Date && isValid(eventStartAndEnd.from)
      ? format(eventStartAndEnd.from, "d 'de' LLL", { locale: ptBR })
      : "Data inválida";
  const formattedEndDate =
    eventStartAndEnd?.to instanceof Date && isValid(eventStartAndEnd.to)
      ? format(eventStartAndEnd.to, "d 'de' LLL", { locale: ptBR })
      : "Data inválida";

  const displayedDate =
    formattedStartDate !== "Data inválida" &&
    formattedEndDate !== "Data inválida"
      ? `${formattedStartDate} até ${formattedEndDate}`
      : null;

  const today = new Date();

  async function handleUpdateTrip() {
    if (!eventStartAndEnd?.from || !eventStartAndEnd?.to || !destination) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await api.put(`/trips/${tripId}`, {
        destination,
        starts_at: eventStartAndEnd.from,
        ends_at: eventStartAndEnd.to,
      });

      if (response.status === 200) {
        
          window.location.reload();
        closeUpdateDestinationAndDateModal();
      }
    } catch (error) {
      console.error("Erro ao atualizar a viagem:", error);
      toast.error("Erro ao atualizar a viagem. Por favor, tente novamente.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
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

      <div className="w-[740px] max-h-[80vh] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 overflow-auto">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Alterar local/data</h2>
            <button onClick={closeUpdateDestinationAndDateModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Atualize o destino, data e hora da sua viagem. Atenção: Suas atividades cadastradas serão apagadas.
          </p>
        </div>

        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
          <div className="flex items-center gap-2 flex-1">
            <MapPin className="size-5 text-zinc-400" />
            <input
              className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
              type="text"
              placeholder="Para onde você vai?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <button
            onClick={openDatePicker}
            className="flex items-center gap-2 text-left w-[240px]"
          >
            <Calendar className="size-5 text-zinc-400" />
            <span className="text-lg text-zinc-400 w-40 flex-1">
              {displayedDate || "Quando?"}
            </span>
          </button>

          {isDatePickerOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
              <div className="max-h-[80vh] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5 overflow-auto">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Selecione a data</h2>
                    <button onClick={closeDatePicker}>
                      <X className="size-5 text-zinc-400" />
                    </button>
                  </div>
                </div>

                <DayPicker
                  mode="range"
                  selected={eventStartAndEnd}
                  onSelect={setEventStartAndEnd}
                  locale={ptBR}
                  disabled={{ before: today }}
                />
              </div>
            </div>
          )}

          <Button variant="primary" onClick={handleUpdateTrip}>
            Atualizar
          </Button>
        </div>
      </div>
    </div>
  );
}
