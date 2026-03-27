import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wrench, BookOpen, HelpCircle, LayoutDashboard, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../lib/i18n";
import LangSwitcher from "./LangSwitcher";

const navItems = [
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Admin", href: "/admin", icon: LayoutDashboard },
];

export default function HUDNav({ tenant, onChangeTenant }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="h-full max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            {tenant?.logo_url ? (
              <img src={tenant.logo_url} alt={tenant.brand_name} className="h-8 w-8 rounded object-contain" />
            ) : (
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Wrench className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <span className="font-heading font-bold text-sm tracking-tight">
              {tenant?.brand_name || "SHIFT-CMS"}
            </span>
          </Link>

          {/* GEO Pulse */}
          {tenant?.city && (
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span>{tenant.city}</span>
              {tenant.geo_lat && (
                <span className="text-chrome">
                  [{tenant.geo_lat.toFixed(4)}, {tenant.geo_lng.toFixed(4)}]
                </span>
              )}
            </div>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {onChangeTenant && (
              <button
                onClick={onChangeTenant}
                className="text-xs font-medium tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("changeService")}
              </button>
            )}
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-xs font-medium tracking-wide uppercase transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <LangSwitcher />
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Scan line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent hud-scan-line" />
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-14"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-2xl font-heading font-bold tracking-tight"
                  >
                    <item.icon className="h-6 w-6 text-primary" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <LangSwitcher className="mt-4" />
              {tenant?.city && (
                <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground mt-8">
                  <MapPin className="h-4 w-4 text-primary" />
                  {tenant.city} · {tenant.address}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}