interface TimeSlotGridProps {
  slots: string[];          // all possible slots for this doctor e.g. ["09:00", "10:00"]
  bookedSlots: string[];    // slots already booked on the selected date
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export function TimeSlotGrid({
  slots,
  bookedSlots,
  selectedSlot,
  onSelect,
}: TimeSlotGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedSlot === slot;

        return (
          <button
            key={slot}
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={`
              py-2.5 px-3 rounded-lg text-sm font-medium border-[1.5px] transition-all
              ${
                isBooked
                  ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary/10 text-primary border-primary"
                  : "bg-white text-neutral-900 border-neutral-200 hover:border-primary"
              }
            `}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
