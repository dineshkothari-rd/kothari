import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden bg-slate-950 text-white">
      <img
        src="/images/pg-hero.png"
        alt="Modern paying guest accommodation room"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/78 to-slate-950/15" />

      <div className="container-shell relative flex min-h-[calc(100svh-4rem)] items-center py-16 sm:py-20">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-teal-100 backdrop-blur">
            Rated PG accommodation in Jaipur
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Kothari PG
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            Comfortable rooms, practical amenities, and a safer everyday living
            experience for students and working professionals.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/rooms"
              className="rounded-lg bg-teal-500 px-6 py-3 text-center font-bold text-slate-950 transition hover:bg-teal-400"
            >
              View Rooms & Pricing
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-center font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              Book a Visit
            </Link>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              { value: "50+", label: "Tenants" },
              { value: "4.9", label: "Rating" },
              { value: "3+", label: "Years" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur"
              >
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
