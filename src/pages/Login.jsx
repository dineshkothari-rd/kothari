import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      {/* Left Side — Gradient */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-80px] left-[-40px] w-80 h-80 bg-white/5 rounded-full" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
            🏠
          </div>
          <span className="text-white text-xl font-extrabold tracking-tight">
            Kothari PG
          </span>
        </div>

        {/* Center Content */}
        <div className="relative">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Manage your PG <br />
            <span className="text-cyan-300">effortlessly</span>
          </h2>
          <p className="text-white/70 text-base leading-relaxed mb-8">
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
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium"
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
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl">
              🏠
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
