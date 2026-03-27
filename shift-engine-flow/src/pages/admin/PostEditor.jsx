import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useI18n } from "../../lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, ArrowLeft, Plus, Trash2, Eye } from "lucide-react";
import ReactQuill from "react-quill";
import SEOScoreBadge from "../../components/SEOScoreBadge";
import { calculateSEOScore, generateSlug } from "../../lib/seoHelpers";

export default function PostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const isNew = id === "new";

  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    featured_image: "", category_id: "", tag_ids: [],
    meta_title: "", meta_description: "", voiceover_url: "",
    video_embed: "", status: "draft", reading_time_min: 0,
    geo_city: "", author_name: "", tenant_id: "",
    related_post_ids: []
  });
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const tenantId = localStorage.getItem("shift_cms_active_tenant") || "";
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    async function load() {
      const [cats, allTags] = await Promise.all([
      base44.entities.Category.list(),
      base44.entities.Tag.list()]
      );
      setCategories(cats);
      setTags(allTags);

      if (!isNew) {
        const posts = await base44.entities.Post.filter({ id });
        if (posts.length > 0) {
          const p = posts[0];
          setForm({
            title: p.title || "", slug: p.slug || "", excerpt: p.excerpt || "",
            content: p.content || "", featured_image: p.featured_image || "",
            category_id: p.category_id || "", tag_ids: p.tag_ids || [],
            meta_title: p.meta_title || "", meta_description: p.meta_description || "",
            voiceover_url: p.voiceover_url || "", video_embed: p.video_embed || "",
            status: p.status || "draft", reading_time_min: p.reading_time_min || 0,
            geo_city: p.geo_city || "", author_name: p.author_name || "",
            tenant_id: p.tenant_id || tenantId, related_post_ids: p.related_post_ids || []
          });
          const postFaqs = await base44.entities.PostFAQ.filter({ post_id: p.id });
          setFaqs(postFaqs.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
        }
      } else {
        setForm((f) => ({ ...f, tenant_id: tenantId }));
      }
      setLoading(false);
    }
    load();
  }, [id, isNew]);

  function updateField(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && (isNew || !prev.slug)) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  }

  async function handleSave() {
    setSaving(true);
    const { score } = calculateSEOScore(form);
    const data = {
      ...form,
      seo_score: score,
      published_at: form.status === "published" && !form.published_at ?
      new Date().toISOString() :
      form.published_at || undefined
    };

    let postId = id;
    if (isNew) {
      const created = await base44.entities.Post.create(data);
      postId = created.id;
    } else {
      await base44.entities.Post.update(id, data);
    }

    // Save FAQs
    const existingFaqs = isNew ? [] : await base44.entities.PostFAQ.filter({ post_id: postId });
    for (const ef of existingFaqs) {
      if (!faqs.find((f) => f.id === ef.id)) {
        await base44.entities.PostFAQ.delete(ef.id);
      }
    }
    for (let i = 0; i < faqs.length; i++) {
      const faq = faqs[i];
      const faqData = {
        post_id: postId,
        tenant_id: form.tenant_id,
        question: faq.question,
        answer: faq.answer,
        sort_order: i
      };
      if (faq.id && !isNew) {
        await base44.entities.PostFAQ.update(faq.id, faqData);
      } else {
        await base44.entities.PostFAQ.create(faqData);
      }
    }

    setSaving(false);
    navigate("/admin/posts");
  }

  function addFAQ() {
    setFaqs((prev) => [...prev, { question: "", answer: "", sort_order: prev.length }]);
  }

  function updateFAQ(index, field, value) {
    setFaqs((prev) => prev.map((f, i) => i === index ? { ...f, [field]: value } : f));
  }

  function removeFAQ(index) {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  }

  const seoData = calculateSEOScore(form);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>);

  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/posts")} className="p-1.5 rounded hover:bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-heading font-black text-xl tracking-tight">
            {isNew ? t("newArticle") : "Upravit článek"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <SEOScoreBadge score={seoData.score} />
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5">
            <Save className="h-4 w-4" />
            {saving ? "Ukládám..." : t("save")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + Slug */}
          <div className="space-y-3 p-5 border border-border rounded">
            <div>
              <Label className="text-xs font-mono">{t("title")}</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder={t("title") + "..."}
                className="mt-1" />
              
            </div>
            <div>
              <Label className="text-xs font-mono">URL {t("slug")}</Label>
              <Input
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="url-slug"
                className="mt-1 font-mono text-sm" />
              
            </div>
            <div>
              <Label className="text-xs font-mono">{t("shortDescription")}</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="Krátký popis..."
                rows={2}
                className="mt-1" />
              
            </div>
          </div>

          {/* Content */}
          







          

          {/* Media */}
          <div className="p-5 border border-border rounded space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {t("media")}
            </h3>
            <div>
              <Label className="text-xs font-mono">{t("featuredImageUrl")}</Label>
              <Input
                value={form.featured_image}
                onChange={(e) => updateField("featured_image", e.target.value)}
                placeholder="https://..."
                className="mt-1" />
              
            </div>
            <div>
              <Label className="text-xs font-mono">{t("videoEmbedUrl")}</Label>
              <Input
                value={form.video_embed}
                onChange={(e) => updateField("video_embed", e.target.value)}
                placeholder="https://youtube.com/embed/..."
                className="mt-1" />
              
            </div>
            <div>
              <Label className="text-xs font-mono">{t("voiceoverUrl")}</Label>
              <Input
                value={form.voiceover_url}
                onChange={(e) => updateField("voiceover_url", e.target.value)}
                placeholder="https://..."
                className="mt-1" />
              
            </div>
          </div>

          {/* Inline FAQs */}
          <div className="p-5 border border-border rounded">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
               {t("postFAQs")} ({faqs.length})
              </h3>
              <Button variant="outline" size="sm" onClick={addFAQ} className="gap-1 text-xs">
                <Plus className="h-3 w-3" /> {t("addFAQ")}
              </Button>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) =>
              <div key={i} className="p-3 border border-border rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-chrome">#{i + 1}</span>
                    <button onClick={() => removeFAQ(i)} className="p-1 hover:bg-destructive/10 rounded">
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                  <Input
                  value={faq.question}
                  onChange={(e) => updateFAQ(i, "question", e.target.value)}
                  placeholder={t("question") + "..."} />
                
                  <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(i, "answer", e.target.value)}
                  placeholder={t("answer") + "..."}
                  rows={2} />
                
                </div>
              )}
              {faqs.length === 0 &&
              <p className="text-xs text-muted-foreground text-center py-4">
                  {t("addFAQ3To6Questions")}
                </p>
              }
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="p-5 border border-border rounded space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {t("published")}
            </h3>
            <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("draft")}</SelectItem>
                <SelectItem value="published">{t("published")}</SelectItem>
                <SelectItem value="archived">{t("archived")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category + Tags */}
          <div className="p-5 border border-border rounded space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {t("categoriesLabel")}
            </h3>
            <div>
              <Label className="text-xs font-mono">{t("category")}</Label>
              <Select value={form.category_id} onValueChange={(v) => updateField("category_id", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder={t("select") + "..."} /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) =>
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-mono">{t("tagsLabel")}</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {tags.map((tag) =>
                <button
                  key={tag.id}
                  onClick={() => {
                    updateField(
                      "tag_ids",
                      form.tag_ids.includes(tag.id) ?
                      form.tag_ids.filter((t) => t !== tag.id) :
                      [...form.tag_ids, tag.id]
                    );
                  }}
                  className={`text-xs font-mono px-2 py-0.5 rounded transition-colors ${
                  form.tag_ids.includes(tag.id) ?
                  "bg-primary text-primary-foreground" :
                  "bg-secondary text-secondary-foreground hover:bg-primary/10"}`
                  }>
                  
                    {tag.name}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="p-5 border border-border rounded space-y-3">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              SEO / GEO
            </h3>
            <div>
              <Label className="text-xs font-mono">{t("metaTitle")}</Label>
              <Input
                value={form.meta_title}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="Meta title..."
                className="mt-1" />
              
              <div className="text-[10px] font-mono text-chrome mt-1">{form.meta_title.length}/60</div>
            </div>
            <div>
              <Label className="text-xs font-mono">{t("metaDescription")}</Label>
              <Textarea
                value={form.meta_description}
                onChange={(e) => updateField("meta_description", e.target.value)}
                placeholder={t("metaDescription") + "..."}
                rows={3}
                className="mt-1" />
              
              <div className="text-[10px] font-mono text-chrome mt-1">{form.meta_description.length}/160</div>
            </div>
            <div>
              <Label className="text-xs font-mono">{t("geoCity")}</Label>
              <Input
                value={form.geo_city}
                onChange={(e) => updateField("geo_city", e.target.value)}
                placeholder="Praha, Brno..."
                className="mt-1" />
              
            </div>
            <div>
              <Label className="text-xs font-mono">{t("author")}</Label>
              <Input
                value={form.author_name}
                onChange={(e) => updateField("author_name", e.target.value)}
                placeholder={t("author") + "..."}
                className="mt-1" />
              
            </div>
            <div>
              <Label className="text-xs font-mono">{t("readingTime")} (min)</Label>
              <Input
                type="number"
                value={form.reading_time_min}
                onChange={(e) => updateField("reading_time_min", parseInt(e.target.value) || 0)}
                className="mt-1" />
              
            </div>
          </div>

          {/* SEO Score breakdown */}
          <div className="p-5 border border-border rounded">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t("seoValidator")}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <SEOScoreBadge score={seoData.score} size="lg" />
              <span className="text-sm font-heading font-medium">
                {seoData.score >= 80 ? t("excellentScore") : seoData.score >= 50 ? t("averageScore") : t("lowScore")}
              </span>
            </div>
            {seoData.issues.length > 0 &&
            <ul className="space-y-1">
                {seoData.issues.map((issue, i) =>
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">•</span>
                    {t(issue)}
                  </li>
              )}
              </ul>
            }
          </div>
        </div>
      </div>
    </div>);

}