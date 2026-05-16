import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const contactInfo = [
  { icon: "📍", text: "Siwani mandi, Bhiwani, Haryana 127046" },
  { icon: "📞", text: "+91 9812416720" },
  { icon: "✉️", text: "kotharipg@gmail.com" },
  { icon: "🕐", text: "Mon - Sat, 10am to 7pm" },
];

function FooterLogo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
          🏠
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">
          Kothari PG
        </span>
      </div>
      <p className="max-w-xs text-sm leading-6 text-gray-400">
        Premium paying guest accommodation for students and working
        professionals.
      </p>
      <div className="mt-2 flex gap-3">
        {["📘", "📸", "🐦"].map((icon) => (
          <div
            key={icon}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/10 text-base transition hover:bg-white/20"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div>
      <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
        Quick Links
      </h3>
      <ul className="space-y-3">
        {quickLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-cyan-400 transition" />
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact() {
  return (
    <div>
      <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
        Contact Us
      </h3>
      <ul className="space-y-3">
        {contactInfo.map((item) => (
          <li
            key={item.text}
            className="flex items-start gap-3 text-gray-400 text-sm"
          >
            <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
            <span className="hover:text-white transition cursor-default">
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} Kothari PG. All rights reserved.
      </p>
      <div className="flex gap-4">
        <span className="text-gray-600 text-xs hover:text-gray-400 cursor-pointer transition">
          Privacy Policy
        </span>
        <span className="text-gray-600 text-xs hover:text-gray-400 cursor-pointer transition">
          Terms of Use
        </span>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 px-4 pb-6 pt-14 transition-colors duration-300 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Top gradient line */}
        <div className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <FooterLogo />
          <FooterLinks />
          <FooterContact />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
