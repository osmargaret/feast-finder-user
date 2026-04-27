import { X, MessageSquare, Star, Heart, Package, Bell, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type Notif } from "@/store/AppProviders";

interface NotificationModalProps {
  notif: Notif;
  onClose: () => void;
}

export function NotificationModal({ notif, onClose }: NotificationModalProps) {
  const Icon = {
    message: MessageSquare,
    review: Star,
    like: Heart,
    order: Package,
    system: Bell,
  }[notif.type || 'system'] || Bell;

  const colorClass = {
    message: "bg-blue-500",
    review: "bg-orange-500",
    like: "bg-red-500",
    order: "bg-green-500",
    system: "bg-primary",
  }[notif.type || 'system'] || "bg-primary";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-in zoom-in-95 fade-in duration-200 overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl ring-1 ring-black/5">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 grid h-16 w-16 place-items-center rounded-3xl ${colorClass} text-white shadow-xl`}>
            <Icon className="h-8 w-8" />
          </div>

          <h3 className="text-2xl font-black italic tracking-tight">{notif.title}</h3>
          <p className="mt-4 text-base font-semibold leading-relaxed text-muted-foreground">
            {notif.body}
          </p>

          <div className="mt-8 flex w-full flex-col gap-3">
            {notif.link ? (
              <Link 
                to={notif.link as any}
                search={notif.search}
                params={notif.params}
                onClick={onClose}
                className="btn-primary w-full justify-center py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                Go to source <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <button 
                onClick={onClose}
                className="btn-primary w-full justify-center py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                Understood
              </button>
            )}
            <button 
              onClick={onClose}
              className="btn-ghost w-full py-4 text-sm font-black uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
