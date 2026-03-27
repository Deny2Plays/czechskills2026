import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import BreadcrumbNav from "../components/BreadcrumbNav";
import StructuredData from "../components/StructuredData";
import { generateFAQSchema } from "../lib/seoHelpers";
import { useI18n } from "../lib/i18n";

export default function FAQItemDetail() {
  const { categorySlug, itemSlug } = useParams();
  const { tenant } = useOutletContext();
  const { t } = useI18n();
  const [category, setCategory] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      const cats = await base44.entities.FAQCategory.filter({ tenant_id: tenant.id, slug: categorySlug });
      if (cats.length > 0) {
        setCategory(cats[0]);
        const items = await base44.entities.FAQItem.filter({
          tenant_id: tenant.id,
          faq_category_id: cats[0].id,
          slug: itemSlug,
        });
        if (items.length > 0) setItem(items[0]);
      }
      setLoading(false);
    }
    load();
  }, [tenant, categorySlug, itemSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="font-heading font-bold text-2xl">{t("questionNotFound")}</h1>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={generateFAQSchema([item])} />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <BreadcrumbNav
          items={[
            { label: t("home"), href: "/" },
            { label: "FAQ", href: "/faq" },
            { label: category?.name || t("categoryLabel"), href: `/faq/${categorySlug}` },
            { label: item.question },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 max-w-3xl"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">
            {category?.name}
          </span>
          <h1 className="font-heading font-black text-2xl md:text-4xl tracking-tight mt-3 leading-tight">
            {item.question}
          </h1>
          <div className="mt-8 text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {item.answer}
          </div>
        </motion.div>
      </div>
    </>
  );
}