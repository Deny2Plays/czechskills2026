import { Link } from "react-router-dom";
import { Clock, Tag, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ArticleCard({ post, category, tags, faqCount, index = 0 }) {
  const categorySlug = category?.slug || "obecne";

  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/blog/${categorySlug}/${post.slug}`} className="block">
        <div className="flex flex-col md:flex-row gap-5 py-6 border-b border-border hover:border-primary/50 transition-all duration-300">
          {/* Image */}
          {post.featured_image && (
            <div className="w-full md:w-56 h-40 md:h-32 flex-shrink-0 overflow-hidden rounded">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Category + Meta */}
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              {category && (
                <span className="text-primary font-semibold uppercase tracking-wider">
                  {category.name}
                </span>
              )}
              {post.published_at && (
                <span>{new Date(post.published_at).toLocaleDateString('cs-CZ')}</span>
              )}
              {post.reading_time_min && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.reading_time_min} min
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {/* Tags + FAQ count */}
            <div className="flex items-center gap-2 flex-wrap">
              {tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs font-mono px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground"
                >
                  {tag.name}
                </span>
              ))}
              {faqCount > 0 && (
                <span className="text-xs font-mono flex items-center gap-1 text-primary">
                  <MessageCircle className="h-3 w-3" />
                  {faqCount} FAQ
                </span>
              )}
            </div>
          </div>

        </div>
      </Link>
    </motion.article>
  );
}