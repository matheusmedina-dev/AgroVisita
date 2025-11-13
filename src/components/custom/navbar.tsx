'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Sprout } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };
  
  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition-opacity">
            <Sprout className="w-7 h-7" />
            <span className="hidden sm:inline">AgroVisita</span>
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/') && pathname === '/'
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            
            <Link
              href="/clientes"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/clientes')
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <Users className="w-5 h-5" />
              Clientes
            </Link>
            
            <Link
              href="/visitas"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/visitas')
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <FileText className="w-5 h-5" />
              Visitas
            </Link>
          </div>
        </div>
        
        {/* Menu Mobile */}
        <div className="md:hidden flex items-center justify-around pb-3 gap-2">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all text-xs ${
              isActive('/') && pathname === '/'
                ? 'bg-white/20 font-semibold'
                : 'hover:bg-white/10'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Início</span>
          </Link>
          
          <Link
            href="/clientes"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all text-xs ${
              isActive('/clientes')
                ? 'bg-white/20 font-semibold'
                : 'hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Clientes</span>
          </Link>
          
          <Link
            href="/visitas"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all text-xs ${
              isActive('/visitas')
                ? 'bg-white/20 font-semibold'
                : 'hover:bg-white/10'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Visitas</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
