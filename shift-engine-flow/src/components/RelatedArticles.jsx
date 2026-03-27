import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function RelatedArticles({ posts, categories }) {
  if (!posts || posts.length === 0) return null;

  return (
    <aside className="mt-16 pt-12 border-t border-border">
      <h3 className="font-heading font-bold text-lg mb-6 flex items-center gap-2">
        <span className="h-px flex-1 bg-border" />
        <span className="px-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Související články
        </span>
        <span className="h-px flex-1 bg-border" />
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => {
          const cat = categories?.find((c) => c.id === post.category_id);
          return (
            <Link
              key={post.id}
              to={`/blog/${cat?.slug || "obecne"}/${post.slug}`}
              className="group p-4 rounded border border-border hover:border-primary/30 transition-all"
            >
              {post.featured_image && (
                <div className="h-32 rounded overflow-hidden mb-3">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <h4 className="font-heading font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <span className="flex items-center gap-1 mt-2 text-xs text-primary font-mono">
                Číst dále <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}