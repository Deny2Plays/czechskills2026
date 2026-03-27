import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Clock, Calendar, MapPin, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import BreadcrumbNav from "../components/BreadcrumbNav";
import VoiceoverPlayer from "../components/VoiceoverPlayer";
import FAQAccordion from "../components/FAQAccordion";
import RelatedArticles from "../components/RelatedArticles";
import StructuredData from "../components/StructuredData";
import { generateArticleSchema, generateFAQSchema } from "../lib/seoHelpers";
import { useI18n } from "../lib/i18n";

export default function BlogDetail() {
  const { category, slug } = useParams();
  const { tenant } = useOutletContext();
  const { t, lang } = useI18n();
  const [post, setPost] = useState(null);
  const [categoryObj, setCategoryObj] = useState(null);
  const [tags, setTags] = useState([]);
  const [postFAQs, setPostFAQs] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!tenant?.id) return;
      const posts = await base44.entities.Post.filter({ tenant_id: tenant.id, slug, status: "published" });
      if (posts.length === 0) { setLoading(false); return; }

      const p = posts[0];
      setPost(p);

      const [cats, allTags, faqs] = await Promise.all([
        base44.entities.Category.filter({ tenant_id: tenant.id }),
        base44.entities.Tag.filter({ tenant_id: tenant.id }),
        base44.entities.PostFAQ.filter({ post_id: p.id }),
      ]);

      setAllCategories(cats);
      setCategoryObj(cats.find((c) => c.id === p.category_id));
      setTags(allTags.filter((t) => (p.tag_ids || []).includes(t.id)));
      setPostFAQs(faqs.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));

      // Load related posts
      if (p.related_post_ids?.length > 0) {
        const allPosts = await base44.entities.Post.filter({ tenant_id: tenant.id, status: "published" });
        setRelatedPosts(allPosts.filter((rp) => p.related_post_ids.includes(rp.id)));
      }

      setLoading(false);
    }
    load();
  }, [tenant, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-20 text-center">
        <h1 className="font-heading font-bold text-2xl">{t("articleNotFound")}</h1>
        <p className="text-muted-foreground mt-2">{t("articleNotFoundDesc")}</p>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={generateArticleSchema(post, tenant, categoryObj)} />
      {postFAQs.length > 0 && <StructuredData data={generateFAQSchema(postFAQs)} />}

      <article className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <div className="py-6">
          <BreadcrumbNav
            items={[
              { label: t("home"), href: "/" },
              { label: "Blog", href: "/blog" },
              { label: categoryObj?.name || t("categoryLabel"),
 href: `/blog` },
              { label: post.title },
            ]}
          />
        </div>

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10"
        >
          {post.featured_image && (
            <div className="h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground mb-4">
            {categoryObj && (
              <span className="text-primary font-semibold uppercase tracking-wider">
                {categoryObj.name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.published_at).toLocaleDateString(lang === 'cs' ? 'cs-CZ' : lang === 'sk' ? 'sk-SK' : lang === 'pl' ? 'pl-PL' : lang === 'de' ? 'de-DE' : 'en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            )}
            {post.reading_time_min && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.reading_time_min} {t("readingTime")}
              </span>
            )}
            {post.geo_city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                {post.geo_city}
              </span>
            )}
          </div>

          <h1 className="font-heading font-black text-3xl md:text-5xl leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-secondary text-secondary-foreground"
                >
                  <Tag className="h-3 w-3" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Voiceover */}
        {post.voiceover_url && (
          <div className="max-w-2xl mb-10">
            <VoiceoverPlayer url={post.voiceover_url} title={`Poslechnout: ${post.title}`} />
          </div>
        )}

        {/* Video Embed */}
        {post.video_embed && (
          <div className="max-w-3xl mb-10">
            <div className="aspect-video rounded-lg overflow-hidden border border-border">
              <iframe
                src={post.video_embed}
                title={post.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        {/* Inline FAQ */}
        {postFAQs.length > 0 && (
          <section className="max-w-3xl mt-16 pt-10 border-t border-border">
            <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-3">
              <span className="text-xs font-mono text-primary uppercase tracking-wider">FAQ</span>
              <span className="h-px flex-1 bg-border" />
            </h2>
            <FAQAccordion items={postFAQs} />
          </section>
        )}

        {/* Related Articles */}
        <div className="max-w-3xl">
          <RelatedArticles posts={relatedPosts} categories={allCategories} />
        </div>

        {/* Author / Footer */}
        {post.author_name && (
          <div className="max-w-3xl mt-12 pt-8 border-t border-border">
            <div className="text-xs font-mono text-muted-foreground">
              {t("author")}: <span className="text-foreground font-semibold">{post.author_name}</span>
            </div>
          </div>
        )}
      </article>
    </>
  );
}