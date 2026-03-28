import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, HelpCircle, Share2, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Analýza & Strategie',
    description: 'Zmapujeme váš autosalon, cílovou skupinu a konkurenci. Navrhneme obsahovou strategii přesně na míru vašemu podnikání.',
  },
  {
    icon: HelpCircle,
    number: '02',
    title: 'Tvorba obsahu',
    description: 'Pod vaší značkou píšeme profesionální blogové články a FAQ sekce. Každý text je optimalizovaný pro vyhledávače i zákazníky.',
  },
  {
    icon: Share2,
    number: '03',
    title: 'Publikace & správa',
    description: 'Články publikujeme přímo na vašem webu, spravujeme komentáře a příspěvky na sociálních sítích. Vy se staráte o auta, my o váš obsah.',
  },
  {
    icon: BarChart3,
    number: '04',
    title: 'Měření & optimalizace',
    description: 'Sledujeme výkon každého článku, měříme návštěvnost a konverze. Průběžně optimalizujeme strategii pro maximální výsledky.',
  },
];

function StepCard({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = step.icon;

  return (
    <div ref={ref} className="relative flex gap-6">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className="w-12 h-12 rounded-xl bg-velocity/10 flex items-center justify-center flex-shrink-0 border border-velocity/20"
        >
          <Icon className="w-5 h-5 text-velocity" />
        </motion.div>
        {index < steps.length - 1 && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
            className="w-0.5 flex-1 bg-gradient-to-b from-velocity/40 to-velocity/5 origin-top mt-2"
          />
        )}
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="pb-12"
      >
        <span className="font-mono text-xs text-velocity/60 tracking-widest">{step.number}</span>
        <h3 className="font-inter font-bold text-xl text-foreground mt-1">{step.title}</h3>
        <p className="mt-2 text-body text-muted-foreground leading-relaxed max-w-lg">{step.description}</p>
      </motion.div>
    </div>
  );
}

export default function ProcessSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="process" className="relative py-24 sm:py-32 bg-muted/30" aria-labelledby="process-heading">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mb-16"
        >
          <p className="font-mono text-velocity text-sm tracking-widest uppercase mb-3">Jak to funguje</p>
          <h2 id="process-heading" className="font-inter font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground">
            Od strategie k výsledkům
            <br />
            <span className="text-velocity">ve 4 krocích</span>
          </h2>
          <p className="mt-4 text-body text-muted-foreground max-w-xl">
            Celý proces je navržen tak, abyste nemuseli řešit nic. Staráme se o váš obsah od A do Z, zatímco vy se můžete soustředit na svůj byznys.
          </p>
        </motion.div>

        <div className="max-w-2xl" styles="display:flex;">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
