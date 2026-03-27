import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQAccordion({ items, showSchema = false }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="divide-y divide-border" role="list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.id || index} role="listitem" className="group">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-start justify-between gap-4 py-5 text-left transition-all hover:pl-2"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-heading font-semibold text-base md:text-lg leading-snug flex-1">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 pr-10 text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Hover glow effect on border */}
            <div className="h-px bg-border group-hover:bg-primary/30 transition-colors" />
          </div>
        );
      })}
    </div>
  );
}