import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import TeamCard from './TeamCard';

const DEV1_IMG = 'https://media.base44.com/images/public/69c6ea5aa81268dfb86be734/9a19b1707_drexler.png';
const DEV2_IMG = 'https://media.base44.com/images/public/69c6ea5aa81268dfb86be734/b35bc781d_kopa.png';

const stats = [
  { value: '50+', label: 'Spravovaných blogů' },
  { value: '2+', label: 'Roky zkušeností' },
  { value: '500+', label: 'Publikovaných článků' },
  { value: '98%', label: 'Spokojenost klientů' },
];

const team = [
  {
    name: 'Denis Drexler',
    role: 'Lead Frontend Engineer',
    image: DEV1_IMG,
    experience: '3 roky zkušenosti',
    email: 'kontakt@denisdrexler.cz',
  },
  {
    name: 'Samuel Kopa',
    role: 'Lead Backend Engineer',
    image: DEV2_IMG,
    experience: '2 roky zkušeností',
    email: 'kontakt@samuelkopa.cz',
  },
];

function AnimatedStat({ stat }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="font-mono text-3xl sm:text-4xl font-bold text-velocity">{stat.value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
    </motion.div>
  );
}

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 sm:py-32" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-velocity text-sm tracking-widest uppercase mb-3">O nás</p>
          <h2 id="about-heading" className="font-inter font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">
            Váš digitální tým
            <br />
            <span className="text-velocity">pro automobilový svět</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-body text-muted-foreground leading-relaxed">
              Jsme profesionální tým, který se věnuje obsahovému marketingu pro autosalony v celé České Republice ale i většině Střední Evropy. Píšeme pro vaše autosalony odborné články, spravujeme blogové sekce a vytváříme FAQ přímo pro vás na míru. Díky tomu přitahujeme pro vaše autosalony zákazníky z celé Evropy.
            </p>
            <p className="mt-4 text-body text-muted-foreground leading-relaxed">
              Naše práce posiluje pozici vašeho autosalonu ve webových vyhledávačích. Kombinujeme SEO strategii s profesionálním copywritingem.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <AnimatedStat key={stat.label} stat={stat} />
              ))}
            </div>
          </motion.div>

          {/* Ticker */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl border border-machined bg-card p-8">
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-6">Naše služby</p>
              <div className="space-y-4">
                {[
                  'Správa blogových sekcí',
                  'Tvorba FAQ pro zákazníky',
                  'SEO optimalizace obsahu',
                  'Správa sociálních sítí',
                  'Content marketing strategie',
                  'Zvýšení konverzí a engagement',
                ].map((service) => (
                  <div key={service} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-velocity/40 group-hover:bg-velocity transition-colors" />
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <div className="mt-20 flex flex-col justify-center">
          <p className="font-mono text-velocity text-sm tracking-widest uppercase mb-8">Náš tým</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            {team.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
