import { Link } from "react-router-dom";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const contactInfo = [
  { icon: "📍", text: "Siwani mandi, Bhiwani, Haryana" },
  { icon: "📞", text: "+91 9812416720" },
  { icon: "✉️", text: "kotharipg@gmail.com" },
];

function FooterLogo() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">🏠 Kothari PG</h2>
      <p className="text-gray-400 text-sm max-w-xs">
        Premium paying guest accommodation in Jaipur for students and working
        professionals.
      </p>
    </div>
  );
}

function FooterLinks() {
  return (
    <div>
      <h3 className="text-white font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-2">
        {quickLinks.map((link) => (
          <li key={link.name}>
            <Link
              to={link.path}
              className="text-gray-400 hover:text-white transition text-sm"
            >
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
      <h3 className="text-white font-semibold mb-4">Contact Us</h3>
      <ul className="space-y-2">
        {contactInfo.map((item) => (
          <li
            key={item.text}
            className="flex items-start gap-2 text-gray-400 text-sm"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} Kothari PG. All rights reserved.
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 px-4 pt-12 pb-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <FooterLogo />
        <FooterLinks />
        <FooterContact />
      </div>
      <FooterBottom />
    </footer>
  );
}
