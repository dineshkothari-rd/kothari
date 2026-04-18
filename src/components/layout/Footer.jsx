import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const contactInfo = [
  { icon: "📍", text: "Malviya Nagar, Jaipur, Rajasthan" },
  { icon: "📞", text: "+91 98765 43210" },
  { icon: "✉️", text: "kotharipg@gmail.com" },
  { icon: "🕐", text: "Mon - Sat, 10am to 7pm" },
];

function FooterLogo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">
          🏠
        </div>
        <span className="text-xl font-extrabold text-white tracking-tight">
          Kothari PG
        </span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
        Premium paying guest accommodation in Jaipur for students and working
        professionals.
      </p>
      <div className="flex gap-3 mt-2">
        {["📘", "📸", "🐦"].map((icon) => (
          <div
            key={icon}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-base cursor-pointer transition"
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
    <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
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
    <footer className="bg-gray-900 dark:bg-gray-950 px-4 pt-14 pb-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Top gradient line */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-full mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <FooterLogo />
          <FooterLinks />
          <FooterContact />
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
