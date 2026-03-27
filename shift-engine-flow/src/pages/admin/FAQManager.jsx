import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X } from "lucide-react";
import { generateSlug } from "../../lib/seoHelpers";
import { useI18n } from "../../lib/i18n";

export default function FAQManager() {
  const { t } = useI18n();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const tenantId = localStorage.getItem("shift_cms_active_tenant") || "";
  const [editingItem, setEditingItem] = useState(null);
  const [editingCat, setEditingCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cats, faqItems] = await Promise.all([
        base44.entities.FAQCategory.filter({ tenant_id: tenantId }, "-created_date"),
        base44.entities.FAQItem.filter({ tenant_id: tenantId }, "-created_date"),
      ]);
      setCategories(cats);
      setItems(faqItems);
      setLoading(false);
    }
    load();
  }, []);

  const filteredCats = categories;
  const filteredItems = items;

  async function saveFAQItem(item) {
    const data = {
      ...item,
      slug: item.slug || generateSlug(item.question),
      tenant_id: tenantId,
    };
    if (item.id) {
      await base44.entities.FAQItem.update(item.id, data);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...data } : i)));
    } else {
      const created = await base44.entities.FAQItem.create(data);
      setItems((prev) => [created, ...prev]);
    }
    setEditingItem(null);
  }

  async function deleteItem(id) {
    if (!confirm(t("confirmDeleteQuestion"))) return;
    await base44.entities.FAQItem.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function saveCategory(cat) {
    const data = {
      ...cat,
      slug: cat.slug || generateSlug(cat.name),
      tenant_id: tenantId,
    };
    if (cat.id) {
      await base44.entities.FAQCategory.update(cat.id, data);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, ...data } : c)));
    } else {
      const created = await base44.entities.FAQCategory.create(data);
      setCategories((prev) => [created, ...prev]);
    }
    setEditingCat(null);
  }

  async function deleteCategory(id) {
    if (!confirm(t("confirmDeleteFAQCategory"))) return;
    await base44.entities.FAQCategory.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-black text-2xl tracking-tight">{t("faqManagement")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredItems.length} {t("questions")} · {filteredCats.length} {t("faqCategories").toLowerCase()}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <div className="border border-border rounded">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-heading font-semibold text-sm">{t("faqCategories")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingCat({ name: "", slug: "", description: "" })}
              className="gap-1 text-xs"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {editingCat && (
            <div className="p-4 border-b border-border space-y-2 bg-secondary/20">
              <Input
                value={editingCat.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setEditingCat((prev) => ({
                    ...prev,
                    name: newName,
                    slug: !prev.id ? generateSlug(newName) : prev.slug,
                  }));
                }}
                placeholder={t("categoryName")}
              />
              <Input
                value={editingCat.slug}
                onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                placeholder={t("urlSlug")}
                className="font-mono text-xs"
              />
              <Textarea
                value={editingCat.description || ""}
                onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                placeholder={`${t("description")}...`}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveCategory(editingCat)} className="gap-1 text-xs">
                  <Save className="h-3 w-3" /> {t("save")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingCat(null)}>
                  <X className="h-3 w-3" />
                </Button>
                </div>
                </div>
                )}

                <div className="divide-y divide-border">
            {filteredCats.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 hover:bg-secondary/30">
                <div>
                  <div className="text-sm font-medium">{cat.name}</div>
                  <div className="text-xs font-mono text-chrome">/{cat.slug}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingCat(cat)}
                    className="p-1 rounded hover:bg-secondary text-xs"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1 rounded hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="lg:col-span-2 border border-border rounded">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-heading font-semibold text-sm">{t("faqItems")}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setEditingItem({
                  question: "", answer: "", slug: "",
                  faq_category_id: filteredCats[0]?.id || "",
                  is_featured: false, status: "active",
                  meta_title: "", meta_description: "",
                })
              }
              className="gap-1 text-xs"
              >
              <Plus className="h-3 w-3" /> {t("newQuestion")}
            </Button>
          </div>

          {editingItem && (
            <div className="p-4 border-b border-border space-y-3 bg-secondary/20">
              <Select
                value={editingItem.faq_category_id}
                onValueChange={(v) => setEditingItem({ ...editingItem, faq_category_id: v })}
              >
                <SelectTrigger><SelectValue placeholder={t("selectCategory")} /></SelectTrigger>
                <SelectContent>
                  {filteredCats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={editingItem.question}
                onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                placeholder={t("question")}
              />
              <Textarea
                value={editingItem.answer}
                onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                placeholder={t("answer")}
                rows={3}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={editingItem.meta_title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, meta_title: e.target.value })}
                  placeholder={t("metaTitle")}
                />
                <Input
                  value={editingItem.meta_description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, meta_description: e.target.value })}
                  placeholder={t("metaDescription")}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={editingItem.is_featured || false}
                    onChange={(e) => setEditingItem({ ...editingItem, is_featured: e.target.checked })}
                  />
                  {t("featured")}
                </label>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => saveFAQItem(editingItem)} className="gap-1 text-xs">
                  <Save className="h-3 w-3" /> {t("save")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                  <X className="h-3 w-3" />
                </Button>
                </div>
                </div>
                )}

                <div className="divide-y divide-border">
            {filteredItems.map((item) => {
              const cat = categories.find((c) => c.id === item.faq_category_id);
              return (
                <div key={item.id} className="flex items-start justify-between p-4 hover:bg-secondary/30">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.question}</span>
                      {item.is_featured && (
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                              {t("featured")}
                            </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.answer}</div>
                    <div className="text-[10px] font-mono text-chrome mt-1">
                      {cat?.name} · /{item.slug}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 rounded hover:bg-secondary text-xs"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {t("noFAQItemsEmpty")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}