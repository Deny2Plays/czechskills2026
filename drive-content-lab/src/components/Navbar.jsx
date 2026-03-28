import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'O nás', href: '#about' },
  { label: 'Jak to funguje', href: '#process' },
  { label: 'Kontakty', href: '#contact' },
];

function NavDot({ isActive }) {
  return (
    <motion.span
      className="block w-1 h-1 rounded-full bg-velocity mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: isActive ? 1.5 : 1, opacity: isActive ? 1 : 0.4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    />
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-velocity/5 border border-machined'
          : 'bg-white/60 backdrop-blur-md border border-transparent'
      }`}
      role="navigation"
      aria-label="Hlavní navigace"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 group"
            aria-label="AutoContent Pro – domů"
          >
            <div className="w-8 h-8 rounded-lg bg-velocity flex items-center justify-center">
              <span className="text-white font-mono font-bold text-sm">A</span>
            </div>
            <span className="font-inter font-bold text-foreground text-lg tracking-tight hidden sm:block">
              Auto<span className="text-velocity">Content</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                className="flex flex-col items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity focus-visible:ring-offset-2 rounded-md px-2 py-1"
                aria-label={`Přejít na sekci ${item.label}`}
              >
                <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
                <NavDot isActive={hoveredItem === item.href} />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = "https://czechskills2026.denisdrexler.cz"}
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full bg-velocity text-white text-sm font-semibold shimmer-btn hover:bg-velocity-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity focus-visible:ring-offset-2"
              style={{ filter: 'drop-shadow(0 0 15px rgba(0,87,255,0.3))' }}
              aria-label="Přejít na seznam našich autosalonů"
            >
              NAŠE AUTOSALONY
            </button>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity"
              aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-machined overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="block w-full text-left text-body font-medium text-foreground/80 hover:text-velocity transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity rounded"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => window.location.href = "https://czechskills2026.denisdrexler.cz"}
                className="w-full mt-2 px-5 py-3 rounded-full bg-velocity text-white text-sm font-semibold text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity focus-visible:ring-offset-2"
                aria-label="Přejít na seznam našich autosalonů"
              >
                NAŠE AUTOSALONY
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
