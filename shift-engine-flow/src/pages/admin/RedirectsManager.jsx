import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X, ArrowRight } from "lucide-react";
import { useI18n } from "../../lib/i18n";

export default function RedirectsManager() {
   const { t } = useI18n();
   const [redirects, setRedirects] = useState([]);
   const tenantId = localStorage.getItem("shift_cms_active_tenant") || "";
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const r = await base44.entities.Redirect.list("-created_date");
      setRedirects(r);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = redirects;

  async function handleSave(redirect) {
    const data = { ...redirect, tenant_id: tenantId };
    if (redirect.id) {
      await base44.entities.Redirect.update(redirect.id, data);
      setRedirects((prev) => prev.map((r) => (r.id === redirect.id ? { ...r, ...data } : r)));
    } else {
      const created = await base44.entities.Redirect.create(data);
      setRedirects((prev) => [created, ...prev]);
    }
    setEditing(null);
  }

  async function handleDelete(id) {
    if (!confirm(t("confirmDeleteCategory"))) return;
    await base44.entities.Redirect.delete(id);
    setRedirects((prev) => prev.filter((r) => r.id !== id));
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
          <h1 className="font-heading font-black text-2xl tracking-tight">{t("redirectsLabel")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} {t("redirectRules")}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => setEditing({ from_path: "", to_path: "", status_code: 301, is_active: true })}
            className="gap-1"
          >
            <Plus className="h-4 w-4" /> {t("newRedirect")}
          </Button>
        </div>
      </div>

      {editing && (
        <div className="p-5 mb-6 border border-primary/30 rounded bg-secondary/20 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="text-xs font-mono text-muted-foreground">{t("fromPath")}</label>
              <Input
                value={editing.from_path}
                onChange={(e) => setEditing({ ...editing, from_path: e.target.value })}
                placeholder={t("oldPagePath")}
                className="mt-1 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-mono text-muted-foreground">{t("toPath")}</label>
              <Input
                value={editing.to_path}
                onChange={(e) => setEditing({ ...editing, to_path: e.target.value })}
                placeholder={t("newPagePath")}
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-muted-foreground">{t("statusCode")}</label>
              <Select
                value={String(editing.status_code)}
                onValueChange={(v) => setEditing({ ...editing, status_code: parseInt(v) })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">Permanent (301)</SelectItem>
                   <SelectItem value="302">Temporary (302)</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

      <div className="border border-border rounded">
        <div className="divide-y divide-border">
          {filtered.map((redirect) => (
            <div key={redirect.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-3 font-mono text-sm min-w-0">
                <span className="truncate text-muted-foreground">{redirect.from_path}</span>
                <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                <span className="truncate text-foreground">{redirect.to_path}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                    redirect.status_code === 301
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {redirect.status_code}
                </span>
              </div>
              <div className="flex gap-1 ml-2">
                <button onClick={() => setEditing(redirect)} className="px-2 py-1 rounded hover:bg-secondary text-xs">
                  {t("edit")}
                </button>
                <button onClick={() => handleDelete(redirect.id)} className="p-1 rounded hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("noRedirectsEmpty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}