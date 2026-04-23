import { useEffect, useState } from "react";
import { MapPin, X, ChevronDown } from "lucide-react";
import { LAGOS_AREAS } from "@/data/mock";
import { useDeliveryArea } from "@/store/AppProviders";

type Variant = "compact" | "block";

export function DeliveryAreaPicker({ variant = "compact" }: { variant?: Variant }) {
  const { area, setArea } = useDeliveryArea();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (variant === "block") {
    return (
      <div className="card-mm flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <p className="text-sm font-bold">
            {mounted && area
              ? <>Delivering to <span className="text-primary">{area}</span></>
              : "Where should we deliver?"}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LAGOS_AREAS.slice(0, 8).map((a) => (
            <button
              key={a}
              onClick={() => setArea(area === a ? null : a)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition ${mounted && area === a ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"}`}
            >
              {a}
            </button>
          ))}
          <select
            value={mounted && area ? area : ""}
            onChange={(e) => setArea(e.target.value || null)}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold"
          >
            <option value="">More areas…</option>
            {LAGOS_AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          {mounted && area && (
            <button onClick={() => setArea(null)} className="rounded-full border border-border px-2.5 py-1 text-xs font-bold text-muted-foreground hover:bg-secondary">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-secondary"
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {mounted && area ? area : "All areas"}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-72 w-52 overflow-auto rounded-2xl border border-border bg-background p-1.5 shadow-2xl">
          <button
            onClick={() => { setArea(null); setOpen(false); }}
            className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-bold ${!mounted || !area ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
          >
            All areas
          </button>
          {LAGOS_AREAS.map((a) => (
            <button
              key={a}
              onClick={() => { setArea(a); setOpen(false); }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-bold ${mounted && area === a ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
