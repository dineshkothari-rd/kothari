import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      aria-label="Toggle theme"
      className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
    >
      {theme === "dark" ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-13H20m-16 0H2.34M18.36 5.64l-.7.7M6.34 17.66l-.7.7M18.36 18.36l-.7-.7M6.34 6.34l-.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
          />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, adminName } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
    ...(isAdmin ? [{ name: "Dashboard", path: "/admin" }] : []),
  ];

  async function handleLogout() {
    await signOut(auth);
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 text-slate-900 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/88 dark:text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-lg text-white shadow-sm dark:bg-white dark:text-slate-950">
            🏠
          </div>
          <span className="text-lg font-extrabold tracking-tight sm:text-xl">
            Kothari Spaces
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-5 md:flex lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                location.pathname === link.path
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-200"
                  : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-gray-900 dark:hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <ThemeToggle />

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {adminName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-gray-800 dark:bg-gray-900 dark:text-slate-200 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-2 border-t border-slate-200 bg-white/96 px-4 pb-4 pt-2 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/96 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                location.pathname === link.path
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-200"
                  : "border-transparent text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-950 px-4 py-2 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-slate-950 px-4 py-2 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
