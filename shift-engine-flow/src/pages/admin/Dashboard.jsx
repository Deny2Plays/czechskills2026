import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useI18n } from "../../lib/i18n";

export default function Dashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    async function load() {
      const tenantId = localStorage.getItem("shift_cms_active_tenant");
      if (!tenantId) return;
      const [posts, faqs, cats, faqItems, tags] = await Promise.all([
      base44.entities.Post.filter({ tenant_id: tenantId }, "-created_date"),
      base44.entities.PostFAQ.filter({ tenant_id: tenantId }),
      base44.entities.Category.filter({ tenant_id: tenantId }),
      base44.entities.FAQItem.filter({ tenant_id: tenantId }),
      base44.entities.Tag.filter({ tenant_id: tenantId })]
      );
      setStats({
        posts: posts.length,
        publishedPosts: posts.filter((p) => p.status === "published").length,
        draftPosts: posts.filter((p) => p.status === "draft").length,
        postFAQs: faqs.length,
        categories: cats.length,
        faqItems: faqItems.length,
        tags: tags.length
      });
      setRecentPosts(posts.slice(0, 5));
    }
    load();
  }, []);

  const statCards = stats ?
  [
  { label: t("articles"), value: stats.posts, sub: `${stats.publishedPosts} pub. / ${stats.draftPosts} ${t("draft").toLowerCase()}`, href: "/admin/posts" },
  { label: t("postFAQs"), value: stats.postFAQs, sub: t("embeddedFAQs"), href: "/admin/posts" },
  { label: t("globalFAQs"), value: stats.faqItems, sub: t("standaloneFAQs"), href: "/admin/faq" },
  { label: t("categoriesLabel"), value: stats.categories, sub: t("blogCategories"), href: "/admin/categories" },
  { label: t("tagsLabel"), value: stats.tags, sub: t("articleTags"), href: "/admin/tags" }] :

  [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading font-black text-2xl md:text-3xl tracking-tight">{t("dashboardLabel")}</h1>
        
      </div>

      {/* Stats Grid */}
      {stats &&
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((card) =>
        <Link
          key={card.label}
          to={card.href}
          className="group p-4 border border-border rounded hover:border-primary/30 transition-all">
          
              <div className="font-mono font-bold text-2xl">{card.value}</div>
              <div className="text-xs font-heading font-medium mt-1">{card.label}</div>
              <div className="text-[10px] font-mono text-chrome mt-0.5">{card.sub}</div>
            </Link>
        )}
        </div>
      }

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">{t("quickActions")}</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/posts/edit/new" className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
            {t("newArticle")}
          </Link>
          <Link to="/admin/categories" className="px-4 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors">
            {t("addCategory")}
          </Link>
          <Link to="/admin/tags" className="px-4 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors">
            {t("addTag")}
          </Link>
          <Link to="/admin/faq" className="px-4 py-2 border border-border rounded text-sm font-medium hover:bg-secondary transition-colors">
            {t("addFAQ")}
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="border border-border rounded">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading font-semibold text-sm">{t("recentArticles")}</h2>
          <Link to="/admin/posts" className="text-xs font-mono text-primary">
            {t("allArticles")} &rarr;
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentPosts.map((post) =>
          <Link
            key={post.id}
            to={`/admin/posts/edit/${post.id}`}
            className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
            
              <div className="min-w-0">
                <div className="font-heading font-medium text-sm truncate">{post.title}</div>
                <div className="text-xs font-mono text-chrome mt-0.5">{post.slug}</div>
              </div>
              <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
              post.status === "published" ?
              "bg-green-100 text-green-700" :
              post.status === "draft" ?
              "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-500"}`
              }>
              
                {post.status === "published" ? t("published") : post.status === "draft" ? t("draft") : t("archived")}
              </span>
            </Link>
          )}
          {recentPosts.length === 0 &&
          <div className="p-8 text-center text-sm text-muted-foreground">
              {t("noArticlesYet")}<Link to="/admin/posts/edit/new" className="text-primary">{t("createFirst")}</Link>
            </div>
          }
        </div>
      </div>
    </div>);

}