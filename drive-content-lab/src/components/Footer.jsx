"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-machined bg-card" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid sm:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <a
              href="#top"
              className="flex items-center gap-2 mb-4 group"
              aria-label="AutoContent Pro – domů"
            >
              <div className="w-8 h-8 rounded-lg bg-velocity flex items-center justify-center overflow-hidden">
                <img
                  src="https://media.base44.com/images/public/69c7972cb0777a84d48a3b47/8acbcb2a2_Gemini_Generated_Image_6nvztj6nvztj6nvz_1.png"
                  alt="AUTOCONTENT PRO"
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="font-inter font-bold text-foreground text-lg tracking-tight">
                Auto<span className="text-velocity">Content</span>
              </span>
            </a>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Profesionální správa obsahu pro autosalony a autoservisy v&nbsp;České republice. SEO, blog a FAQ na míru.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">
              Navigace
            </p>

            <nav aria-label="Patičková navigace" className="space-y-2">
              {[
                { label: "O nás", href: "#about" },
                { label: "Jak to funguje", href: "#process" },
                { label: "Naše autosalony", href: "#dealerships" },
                { label: "Kontakty", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-muted-foreground hover:text-velocity transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity rounded"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-4">
              Kontakt
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <a
                href="tel:+420123456789"
                className="block hover:text-velocity transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity rounded"
              >
                +420 123 456 789
              </a>

              <a
                href="mailto:info@autocontentpro.cz"
                className="block hover:text-velocity transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity rounded"
              >
                info@autocontentpro.cz
              </a>

              <p>Praha, Česká republika</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-machined flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} AutoContent Pro. Všechna práva vyhrazena.
          </p>

          <p className="text-xs text-muted-foreground">
            Marketingová agentura pro autosalony — Praha, Brno, Ostrava, Plzeň
          </p>
        </div>
      </div>
    </footer>
  );
}
