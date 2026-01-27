"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/shared/icons';
import Logo from "@/app/icon.png"

export default function Header() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3">
            <img src={Logo.src} className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold font-headline text-l text-primary">
              Busca Precios
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
