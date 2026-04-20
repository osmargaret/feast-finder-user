import heroImg from "@/assets/hero-food.jpg";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className="relative isolate overflow-hidden pb-16 pt-32 text-white sm:pt-40"
      style={{
        backgroundImage: `var(--gradient-hero), url(${heroImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-mm text-center">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur">
            {eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base font-semibold text-white/85 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
