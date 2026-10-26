// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Projects", href: "/projects" },
    { name: "Skills", href: "/skills" },
    { name: "Login", href: "/login" },
  ];

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="font-bold text-xl">Tj Fraser</div>
        <div className="flex gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-blue-400 transition-colors ${
                  isActive ? "text-blue-400 font-semibold" : "text-gray-300"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
