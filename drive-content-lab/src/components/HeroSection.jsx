import { motion } from 'framer-motion';

const HERO_IMAGE = 'https://media.base44.com/images/public/69c6ea5aa81268dfb86be734/5f3df73f0_generated_image.png';

export default function HeroSection() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading">
      
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Luxusní sportovní automobil v pohybu v moderním garáži"
          className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-aero/90 via-aero/80 to-aero" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          
          <p className="font-mono text-velocity text-sm tracking-widest uppercase mb-6">
            Digitální výkon pro váš autosalon
          </p>
        </motion.div>

        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-inter font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-foreground leading-none">
          
          <span className="italic">Auto</span>Content
          <br />
          <span className="text-velocity">Pro</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mt-8 text-body sm:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
          
          
          Profesionální správa obsahu, blogů a FAQ pro autosalony po celé Střední Evropě.
          <br className="hidden sm:block" />
          Zvyšujeme vaši <span className="text-foreground font-semibold">viditelnost</span>, budujeme <span className="text-foreground font-semibold">důvěru</span> a přivádíme <span className="text-foreground font-semibold">nové zákazníky</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          
          <button
            onClick={() => scrollTo('#contact')}
            className="px-8 py-3.5 rounded-full border-2 border-foreground/20 text-foreground font-semibold text-sm hover:border-velocity hover:text-velocity transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity focus-visible:ring-offset-2"
            aria-label="Přejít na kontakty">
            
            KONTAKTY
          </button>
          <button
            onClick={() => window.location.href = "https://czechskills2026.denisdrexler.cz"}
            className="px-8 py-3.5 rounded-full bg-velocity text-white font-semibold text-sm shimmer-btn hover:bg-velocity-dark transition-colors animate-pulse-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-velocity focus-visible:ring-offset-2"
            aria-label="Přejít na seznam našich autosalonů">
            
            NAŠE AUTOSALONY
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-16">
          
          





          
        </motion.div>
      </div>
    </section>);

}
