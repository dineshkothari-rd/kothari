import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";
const ADMIN_EMAIL = "dineshkothari2021@gmail.com";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      className="p-2 rounded-full bg-blue-700 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-gray-600 transition"
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
  const { currentUser } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/rooms" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
    ...(currentUser ? [{ name: "My Dashboard", path: "/tenant" }] : []),
    ...(currentUser?.email === ADMIN_EMAIL
      ? [{ name: "Admin", path: "/admin" }]
      : []),
  ];

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          🏠 Kothari PG
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-medium hover:text-blue-200 transition ${
                location.pathname === link.path
                  ? "underline underline-offset-4"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <ThemeToggle />
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-100 dark:text-gray-300">
                👋 {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full font-semibold hover:bg-blue-100 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full font-semibold hover:bg-blue-100 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            className="text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-7 h-7"
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
        <div className="md:hidden bg-blue-700 dark:bg-gray-800 px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`font-medium hover:text-blue-200 transition ${
                location.pathname === link.path
                  ? "underline underline-offset-4"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-1.5 rounded-full font-semibold text-center hover:bg-blue-100 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-white text-blue-600 px-4 py-1.5 rounded-full font-semibold text-center hover:bg-blue-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
