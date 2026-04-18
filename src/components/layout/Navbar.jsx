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
      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
    >
      {theme === "dark" ? (
        <svg
          className="w-4 h-4 text-white"
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
          className="w-4 h-4 text-white"
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
    navigate("/login");
  }

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-white shadow-lg transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">
            🏠
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Kothari PG
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-semibold transition-all duration-200 hover:text-white/80 ${
                location.pathname === link.path
                  ? "text-white border-b-2 border-white pb-0.5"
                  : "text-white/80"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <ThemeToggle />

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80 font-medium">
                👋 {adminName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-700 px-5 py-1.5 rounded-full text-sm font-bold hover:bg-blue-50 transition shadow"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
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
        <div className="md:hidden bg-blue-800/90 dark:bg-gray-900/95 backdrop-blur-sm px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-semibold py-2 border-b border-white/10 ${
                location.pathname === link.path ? "text-white" : "text-white/75"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 px-4 py-2 rounded-full font-bold text-sm text-center"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-white text-blue-700 px-4 py-2 rounded-full font-bold text-sm text-center"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
