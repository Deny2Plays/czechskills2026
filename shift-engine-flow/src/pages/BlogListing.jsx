import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { useI18n } from "../lib/i18n";
import { Search } from "lucide-react";
import BreadcrumbNav from "../components/BreadcrumbNav";
import ArticleCard from "../components/ArticleCard";
import CategoryFilter from "../components/CategoryFilter";
import Pagination from "../components/Pagination";

const POSTS_PER_PAGE = 10;

export default function BlogListing() {
  const { tenant } = useOutletContext();
  const { t, tf } = useI18n();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [postFAQCounts, setPostFAQCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      const [p, c, t, faqs] = await Promise.all([
        base44.entities.Post.filter({ tenant_id: tenant.id, status: "published" }, "-published_at"),
        base44.entities.Category.filter({ tenant_id: tenant.id }),
        base44.entities.Tag.filter({ tenant_id: tenant.id }),
        base44.entities.PostFAQ.filter({ tenant_id: tenant.id }),
      ]);
      setPosts(p);
      setCategories(c);
      setTags(t);
      // Count FAQs per post
      const counts = {};
      faqs.forEach((faq) => {
        counts[faq.post_id] = (counts[faq.post_id] || 0) + 1;
      });
      setPostFAQCounts(counts);
      setLoading(false);
    }
    load();
  }, [tenant]);

  // Filtered posts
  const filtered = posts.filter((post) => {
    if (selectedCategory && post.category_id !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        (post.excerpt || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <BreadcrumbNav
        items={[
          { label: t("home"), href: "/" },
          { label: "Blog" },
        ]}
      />

      {/* Header */}
      <div className="mt-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs font-mono text-primary uppercase tracking-[0.2em]">
            {t("contentHub")}
          </span>
          <h1 className="font-heading font-black text-3xl md:text-5xl tracking-tight mt-2">
            Blog
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg">
            {t("blogSubtitle")}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("searchArticles")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs font-mono text-chrome mb-4">
        {filtered.length} {tf("articleCount", filtered.length)}
        {selectedCategory && (
          <span>
            {" "}{t("inCategory")}{" "}
            <span className="text-primary">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </span>
          </span>
        )}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : paginated.length > 0 ? (
        <div>
          {paginated.map((post, i) => (
            <ArticleCard
              key={post.id}
              post={post}
              category={categories.find((c) => c.id === post.category_id)}
              tags={tags.filter((t) => (post.tag_ids || []).includes(t.id))}
              faqCount={postFAQCounts[post.id] || 0}
              index={i}
            />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">{t("noArticlesFoundEmpty")}</p>
        </div>
      )}
    </div>
  );
}