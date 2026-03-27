import { useState, useEffect } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import BreadcrumbNav from "../components/BreadcrumbNav";
import FAQAccordion from "../components/FAQAccordion";
import StructuredData from "../components/StructuredData";
import { generateFAQSchema } from "../lib/seoHelpers";
import { useI18n } from "../lib/i18n";

export default function FAQCategoryDetail() {
  const { categorySlug } = useParams();
  const { tenant } = useOutletContext();
  const { t, tf } = useI18n();
  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      const cats = await base44.entities.FAQCategory.filter({ tenant_id: tenant.id, slug: categorySlug });
      if (cats.length === 0) { setLoading(false); return; }
      const cat = cats[0];
      setCategory(cat);
      const faqItems = await base44.entities.FAQItem.filter({
        tenant_id: tenant.id,
        faq_category_id: cat.id,
        status: "active",
      });
      setItems(faqItems.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      setLoading(false);
    }
    load();
  }, [tenant, categorySlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="font-heading font-bold text-2xl">{t("categoryNotFound")}</h1>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={generateFAQSchema(items)} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <BreadcrumbNav
          items={[
            { label: t("home"), href: "/" },
            { label: "FAQ", href: "/faq" },
            { label: category.name },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-10"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">FAQ</span>
          <h1 className="font-heading font-black text-3xl md:text-4xl tracking-tight mt-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground mt-3 max-w-lg">{category.description}</p>
          )}
          <div className="text-xs font-mono text-chrome mt-4">
            {items.length} {tf("questionCount", items.length)}
          </div>
        </motion.div>

        <div className="max-w-3xl">
          <FAQAccordion items={items} />
        </div>

        {/* Individual FAQ links for SEO */}
        <div className="max-w-3xl mt-12 space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/faq/${categorySlug}/${item.slug}`}
              className="block text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              → {item.question}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}