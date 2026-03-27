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

export default function CategoriesManager() {
  const { t } = useI18n();
  const [categories, setCategories] = useState([]);
  const tenantId = localStorage.getItem("shift_cms_active_tenant") || "";
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const cats = await base44.entities.Category.filter({ tenant_id: tenantId }, "-created_date");
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = categories;

  async function handleSave(cat) {
    const data = {
      ...cat,
      slug: cat.slug || generateSlug(cat.name),
      tenant_id: tenantId,
    };
    if (cat.id) {
      await base44.entities.Category.update(cat.id, data);
      setCategories((prev) => prev.map((c) => (c.id === cat.id ? { ...c, ...data } : c)));
    } else {
      const created = await base44.entities.Category.create(data);
      setCategories((prev) => [created, ...prev]);
    }
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm(t("confirmDeleteCategory"))) return;
    await base44.entities.Category.delete(id);
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
          <h1 className="font-heading font-black text-2xl tracking-tight">{t("categoriesBlog")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} {t("categoriesLabel").toLowerCase()}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setEditing({ name: "", slug: "", description: "", meta_title: "", meta_description: "" })}
            className="gap-1"
            >
            <Plus className="h-4 w-4" /> {t("newCategory")}
            </Button>
        </div>
      </div>

      {editing && (
        <div className="p-5 mb-6 border border-primary/30 rounded space-y-3 bg-secondary/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-mono">{t("name")}</Label>
              <Input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-mono">{t("slug")}</Label>
              <Input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                className="mt-1 font-mono"
                placeholder={editing.name ? generateSlug(editing.name) : ""}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-mono">{t("description")}</Label>
            <Textarea
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={2}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-mono">{t("metaTitle")}</Label>
              <Input
                value={editing.meta_title || ""}
                onChange={(e) => setEditing({ ...editing, meta_title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs font-mono">{t("metaDescription")}</Label>
              <Input
                value={editing.meta_description || ""}
                onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSave(editing)} className="gap-1 text-xs">
              <Save className="h-3 w-3" /> {t("save")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              <X className="h-3 w-3" /> {t("cancel")}
            </Button>
            </div>
        </div>
      )}

      <div className="border border-border rounded">
        <div className="divide-y divide-border">
          {filtered.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
              <div>
                <div className="font-heading font-medium text-sm">{cat.name}</div>
                <div className="text-xs font-mono text-chrome mt-0.5">/{cat.slug}</div>
                {cat.description && (
                  <div className="text-xs text-muted-foreground mt-1">{cat.description}</div>
                )}
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(cat)} className="px-2 py-1 rounded hover:bg-secondary text-xs">
                  {t("edit")}
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("noCategoriesEmpty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}