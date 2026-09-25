import { Calendar, GraduationCap, Images } from "lucide-react";

export type EventCardData = {
  id: number;
  name?: string;
  title?: string;
  date?: string;
  type?: string;
  thumbnail?: string | null;
};

export default function EventCard({
  event,
  apiUrl,
  onClick,
}: {
  event: EventCardData;
  apiUrl: string;
  onClick: () => void;
}) {
  const isPersonal = event.type === "PERSONAL";

  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-[26px] border border-line-soft bg-card p-0 text-left transition hover:border-brand/40 hover:-translate-y-1"
    >
      <div className="relative h-52 overflow-hidden bg-card-2">
        {event.thumbnail ? (
          <img
            src={`${apiUrl}${event.thumbnail}`}
            alt={event.name || "Event"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-low">
            <Images size={32} />
          </div>
        )}

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
          {isPersonal ? <GraduationCap size={13} /> : <Images size={13} />}
          {isPersonal ? "Personal Photo" : "Gallery & Live"}
        </span>
      </div>

      <div className="p-5">
        <h2 className="truncate text-lg text-hi">
          {event.name || event.title}
        </h2>

        {event.title && event.name && (
          <p className="mt-1 truncate text-sm text-mid">{event.title}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {event.date && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[12px] font-semibold text-brand">
              <Calendar size={13} />
              {event.date}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
