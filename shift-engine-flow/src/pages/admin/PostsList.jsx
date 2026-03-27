import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus, Search, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOScoreBadge from "../../components/SEOScoreBadge";
import { useI18n } from "../../lib/i18n";

export default function PostsList() {
  const { t } = useI18n();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const tenantId = localStorage.getItem("shift_cms_active_tenant") || "";

  useEffect(() => {
    async function load() {
      const [p, c] = await Promise.all([
        base44.entities.Post.filter({ tenant_id: tenantId }, "-created_date"),
        base44.entities.Category.filter({ tenant_id: tenantId }),
      ]);
      setPosts(p);
      setCategories(c);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm(t("confirmDeleteArticle"))) return;
    await base44.entities.Post.delete(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.slug || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-black text-2xl tracking-tight">{t("postsLabel")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} {posts.length === 1 ? t("articles").toLowerCase() : t("articles").toLowerCase()}</p>
        </div>
        <Link to="/admin/posts/edit/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("newArticle")}
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchArticles")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="border border-border rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="text-left p-3">{t("title")}</th>
                  <th className="text-left p-3 hidden md:table-cell">{t("category")}</th>
                  <th className="text-left p-3">{t("status")}</th>
                  <th className="text-center p-3 hidden md:table-cell">{t("seo")}</th>
                  <th className="text-right p-3">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((post) => {
                  const cat = categories.find((c) => c.id === post.category_id);
                  return (
                    <tr key={post.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <Link
                          to={`/admin/posts/edit/${post.id}`}
                          className="font-heading font-medium text-sm hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                        <div className="text-xs font-mono text-chrome mt-0.5">/{post.slug}</div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-xs font-mono">{cat?.name || "—"}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded ${
                            post.status === "published"
                              ? "bg-green-100 text-green-700"
                              : post.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                          >
                             {post.status === "published" ? t("published") : post.status === "draft" ? t("draft") : t("archived")}
                           </span>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex justify-center">
                          {post.seo_score !== undefined && post.seo_score !== null ? (
                            <SEOScoreBadge score={post.seo_score} />
                          ) : (
                            <span className="text-xs text-chrome">—</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {post.status === "published" && post.slug && (
                            <Link
                              to={`/blog/${cat?.slug || "obecne"}/${post.slug}`}
                              className="p-1.5 rounded hover:bg-secondary transition-colors"
                              title={t("viewOnSite")}
                                >
                                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDelete(post.id)}
                             className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
                             title={t("delete")}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
           <div className="p-8 text-center text-sm text-muted-foreground">
             {t("noArticlesInTable")}
           </div>
          )}
        </div>
      )}
    </div>
  );
}