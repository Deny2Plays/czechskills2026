import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle } from "lucide-react";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FAQAccordion from "../components/FAQAccordion";
import StructuredData from "../components/StructuredData";
import { generateFAQSchema } from "../lib/seoHelpers";

export default function FAQHub() {
  const { tenant } = useOutletContext();
  const { t, tf } = useI18n();
  const [faqCategories, setFaqCategories] = useState([]);
  const [faqItems, setFaqItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      const [cats, items] = await Promise.all([
        base44.entities.FAQCategory.filter({ tenant_id: tenant.id }),
        base44.entities.FAQItem.filter({ tenant_id: tenant.id, status: "active" }),
      ]);
      setFaqCategories(cats.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      setFaqItems(items.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      setLoading(false);
    }
    load();
  }, [tenant]);

  const allFeatured = faqItems.filter((i) => i.is_featured);

  return (
    <>
      <StructuredData data={generateFAQSchema(faqItems)} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <BreadcrumbNav
          items={[
            { label: t("home"), href: "/" },
            { label: "FAQ" },
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-12"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">
            {t("supportCenter")}
          </span>
          <h1 className="font-heading font-black text-3xl md:text-5xl tracking-tight mt-2">
            {t("faqTitle")}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg">
            {t("faqSubtitle")}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured FAQs */}
            {allFeatured.length > 0 && (
              <section className="mb-16">
                <h2 className="text-xs font-mono text-primary uppercase tracking-[0.2em] mb-6">
                  {t("featuredQuestions")}
                </h2>
                <FAQAccordion items={allFeatured} />
              </section>
            )}

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {faqCategories.map((cat, i) => {
                const catItems = faqItems.filter((fi) => fi.faq_category_id === cat.id);
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={`/faq/${cat.slug}`}
                      className="group block p-6 border border-border rounded hover:border-primary/30 transition-all h-full"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <HelpCircle className="h-5 w-5 text-primary mb-3" />
                          <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">
                            {cat.name}
                          </h3>
                          {cat.description && (
                            <p className="text-sm text-muted-foreground mt-2">{cat.description}</p>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-chrome group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                      </div>
                      <div className="mt-4 text-xs font-mono text-chrome">
                        {catItems.length} {tf("questionCount", catItems.length)}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* All FAQ by category */}
            {faqCategories.map((cat) => {
              const catItems = faqItems.filter((fi) => fi.faq_category_id === cat.id);
              if (catItems.length === 0) return null;
              return (
                <section key={cat.id} className="mb-12" id={cat.slug}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="font-heading font-bold text-xl">{cat.name}</h2>
                    <span className="h-px flex-1 bg-border" />
                    <Link
                      to={`/faq/${cat.slug}`}
                      className="text-xs font-mono text-primary flex items-center gap-1"
                    >
                      {t("detail")} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <FAQAccordion items={catItems} />
                </section>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}