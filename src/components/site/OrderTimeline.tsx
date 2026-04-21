import { Check, ChefHat, Bike, PackageCheck, ClipboardList, XCircle } from "lucide-react";
import type { Order } from "@/store/AppProviders";

const STEPS: { key: Exclude<Order["status"], "cancelled">; label: string; icon: React.ReactNode }[] = [
  { key: "pending",          label: "Order placed",     icon: <ClipboardList className="h-4 w-4" /> },
  { key: "preparing",        label: "Preparing",        icon: <ChefHat className="h-4 w-4" /> },
  { key: "out-for-delivery", label: "Out for delivery", icon: <Bike className="h-4 w-4" /> },
  { key: "delivered",        label: "Delivered",        icon: <PackageCheck className="h-4 w-4" /> },
];

export function OrderTimeline({ status }: { status: Order["status"] }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-destructive/5 p-4 text-destructive">
        <XCircle className="h-5 w-5" />
        <p className="text-sm font-bold">Order cancelled</p>
      </div>
    );
  }
  const currentIdx = STEPS.findIndex((s) => s.key === status);
  return (
    <ol className="relative grid grid-cols-4 gap-2">
      {STEPS.map((s, i) => {
        const reached = i <= currentIdx;
        const isCurrent = i === currentIdx;
        return (
          <li key={s.key} className="flex flex-col items-center text-center">
            <div className="relative w-full">
              {i > 0 && (
                <span
                  className={`absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${i <= currentIdx ? "bg-primary" : "bg-border"}`}
                  aria-hidden
                />
              )}
              <div
                className={`relative mx-auto grid h-9 w-9 place-items-center rounded-full ring-2 ring-background ${
                  reached ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                } ${isCurrent ? "animate-pulse" : ""}`}
              >
                {reached && !isCurrent ? <Check className="h-4 w-4" /> : s.icon}
              </div>
            </div>
            <p className={`mt-2 text-[11px] font-bold sm:text-xs ${reached ? "text-foreground" : "text-muted-foreground"}`}>
              {s.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
