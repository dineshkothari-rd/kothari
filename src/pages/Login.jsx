import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Left Side — Gradient */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-slate-950 p-12 relative overflow-hidden">
        <img
          src="/images/pg-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-slate-950/70" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-400 rounded-lg flex items-center justify-center text-sm font-black text-slate-950">
            KP
          </div>
          <span className="text-white text-xl font-extrabold tracking-tight">
            Kothari PG
          </span>
        </div>

        {/* Center Content */}
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Manage your PG with calm control.
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Track tenants, payments, and notices all from one powerful
            dashboard.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              "👥 Tenant management",
              "💰 Payment tracking",
              "📋 Notice board",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 text-white text-sm font-medium"
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Kothari PG. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center text-sm font-black text-white">
              KP
            </div>
            <span className="text-gray-800 dark:text-white text-xl font-extrabold">
              Kothari PG
            </span>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
