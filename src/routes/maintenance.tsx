import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "We'll be back soon — MenuMenu" },
      { name: "description", content: "MenuMenu is undergoing scheduled maintenance. We'll be back shortly." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  const [t, setT] = useState({ h: 1, m: 30, s: 0 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let s = p.s - 1, m = p.m, h = p.h;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid min-h-screen place-items-center px-4 pt-32">
      <div className="max-w-lg text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl text-white" style={{ background: "var(--gradient-primary)" }}>
          <Wrench className="h-9 w-9" />
        </span>
        <h1 className="mt-6 text-4xl font-black sm:text-5xl">We'll be back soon</h1>
        <p className="mt-3 text-muted-foreground">We're rolling out improvements to make MenuMenu faster and tastier. Hang tight.</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {([["Hours", t.h], ["Minutes", t.m], ["Seconds", t.s]] as const).map(([l, v]) => (
            <div key={l} className="card-mm w-24 p-4">
              <p className="text-3xl font-black tabular-nums">{String(v).padStart(2, "0")}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <a href="/" className="btn-primary mt-8 inline-flex">Back to home</a>
      </div>
    </section>
  );
}

