import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useI18n } from "../lib/i18n";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, HelpCircle, BarChart3, Globe } from "lucide-react";
import StructuredData from "../components/StructuredData";
import { generateLocalBusinessSchema } from "../lib/seoHelpers";

export default function Home() {
  const { tenant } = useOutletContext();
  const { t } = useI18n();
  const [stats, setStats] = useState({ posts: 0, faqs: 0, categories: 0 });
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    async function load() {
      const tenantId = tenant?.id;
      if (!tenantId) return;
      const [posts, faqs, cats] = await Promise.all([
        base44.entities.Post.filter({ tenant_id: tenantId, status: "published" }, "-published_at", 3),
        base44.entities.FAQItem.filter({ tenant_id: tenantId, status: "active" }),
        base44.entities.Category.filter({ tenant_id: tenantId }),
      ]);
      setStats({ posts: posts.length, faqs: faqs.length, categories: cats.length });
      setRecentPosts(posts);
    }
    load();
  }, [tenant]);

  return (
    <>
      <StructuredData data={generateLocalBusinessSchema(tenant)} />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/69c64b150d9359dc79989c51/1979f6d36_generated_0a6ba0bc.png"
            alt="Precision automotive engineering"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-4">
              AutoContent Pro
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
              {tenant?.heading ? (
                tenant.heading
              ) : (
                t("heroDefault")
              )}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              {tenant?.subheading || t("heroSubDefault")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading font-semibold text-sm rounded hover:bg-primary/90 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                {t("exploreBlog")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-heading font-semibold text-sm rounded hover:border-primary/50 transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                FAQ
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Live Stats Ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 flex items-center gap-8 overflow-x-auto">
            <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">{t("systemOnline")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
              <BookOpen className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">{stats.posts} {t("articlesCount")}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
              <HelpCircle className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">{stats.faqs} FAQ</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
              <BarChart3 className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">{stats.categories} {t("categoriesCount")}</span>
            </div>
            {tenant?.city && (
              <div className="flex items-center gap-2 text-xs font-mono whitespace-nowrap">
                <Globe className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">GEO: {tenant.city.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">{t("newest")}</span>
              <h2 className="font-heading font-bold text-2xl md:text-3xl mt-1">{t("blogArticles")}</h2>
            </div>
            <Link
              to="/blog"
              className="text-xs font-mono text-primary flex items-center gap-1 hover:gap-2 transition-all"
            >
              {t("allArticles")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/obecne/${post.slug}`}
                  className="group block p-5 border border-border rounded hover:border-primary/30 transition-all"
                >
                  {post.featured_image && (
                    <div className="h-40 rounded overflow-hidden mb-4">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <h3 className="font-heading font-bold text-base group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                  )}
                  <span className="flex items-center gap-1 mt-3 text-xs font-mono text-primary">
                    {t("readMore")} <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}