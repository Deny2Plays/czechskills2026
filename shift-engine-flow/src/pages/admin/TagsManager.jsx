import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X } from "lucide-react";
import { generateSlug } from "../../lib/seoHelpers";
import { useI18n } from "../../lib/i18n";

export default function TagsManager() {
  const { t } = useI18n();
  const [tags, setTags] = useState([]);
  const tenantId = localStorage.getItem("shift_cms_active_tenant") || "";
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allTags = await base44.entities.Tag.filter({ tenant_id: tenantId }, "-created_date");
      setTags(allTags);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = tags;

  async function handleSave(tag) {
    const data = {
      name: tag.name,
      slug: tag.slug || generateSlug(tag.name),
      color: tag.color || "",
      tenant_id: tenantId,
    };
    if (tag.id) {
      await base44.entities.Tag.update(tag.id, data);
      setTags((prev) => prev.map((t) => (t.id === tag.id ? { ...t, ...data } : t)));
    } else {
      const created = await base44.entities.Tag.create(data);
      setTags((prev) => [created, ...prev]);
    }
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm(t("confirmDeleteTag"))) return;
    await base44.entities.Tag.delete(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
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
          <h1 className="font-heading font-black text-2xl tracking-tight">{t("tagsLabel")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} {filtered.length === 1 ? "tag" : "tagů"}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setEditing({ name: "", slug: "", color: "" })}
            className="gap-1"
            >
            <Plus className="h-4 w-4" /> {t("newTag")}
            </Button>
        </div>
      </div>

      {editing && (
        <div className="p-5 mb-6 border border-primary/30 rounded space-y-3 bg-secondary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              value={editing.name}
              onChange={(e) => {
                const newName = e.target.value;
                setEditing((prev) => ({
                  ...prev,
                  name: newName,
                  slug: !prev.id ? generateSlug(newName) : prev.slug,
                }));
              }}
              placeholder={t("tagName")}
            />
            <Input
              value={editing.slug}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              placeholder="slug"
              className="font-mono"
            />
            <Input
              value={editing.color || ""}
              onChange={(e) => setEditing({ ...editing, color: e.target.value })}
              placeholder={`${t("color")}`}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSave(editing)} className="gap-1 text-xs">
              <Save className="h-3 w-3" /> {t("save")}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              <X className="h-3 w-3" />
            </Button>
            </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {filtered.map((tag) => (
          <div
            key={tag.id}
            className="group flex items-center gap-2 px-3 py-2 border border-border rounded hover:border-primary/30 transition-all"
          >
            {tag.color && (
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color }} />
            )}
            <span className="text-sm font-mono">{tag.name}</span>
            <button
              onClick={() => setEditing(tag)}
              className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
              {t("edit")}
              </button>
            <button
              onClick={() => handleDelete(tag.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 w-full text-center">{t("tagsEmpty")}</p>
        )}
      </div>
    </div>
  );
}