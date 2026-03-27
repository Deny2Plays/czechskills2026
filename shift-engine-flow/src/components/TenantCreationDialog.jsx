import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "../lib/i18n";

export default function TenantCreationDialog({ isOpen, onClose, onCreate }) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    domain: "",
    brand_name: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!form.brand_name.trim()) return;
    setSaving(true);
    await onCreate({
      domain: form.domain || "novy-servis.cz",
      brand_name: form.brand_name,
      city: form.city,
      is_active: true,
    });
    setSaving(false);
    setForm({ domain: "", brand_name: "", city: "" });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading font-semibold text-lg">{t("createNewService")}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <Label className="text-xs font-mono">{t("brandNameLabel")}</Label>
            <Input
              value={form.brand_name}
              onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
              placeholder="AutoServis Praha"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs font-mono">{t("domainLabel")}</Label>
            <Input
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              placeholder="autoservis-praha.cz"
              className="mt-1 font-mono text-sm"
            />
          </div>

          <div>
            <Label className="text-xs font-mono">{t("cityLabel")}</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Praha"
              className="mt-1"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={saving || !form.brand_name.trim()}
            className="flex-1 gap-1"
          >
            <Plus className="h-4 w-4" />
            {saving ? t("creating") : t("createButton")}
          </Button>
        </div>
      </div>
    </div>
  );
}