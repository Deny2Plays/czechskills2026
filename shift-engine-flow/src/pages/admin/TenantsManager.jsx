import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Globe, Plus } from "lucide-react";
import { useI18n } from "../../lib/i18n";
import TenantCreationDialog from "../../components/TenantCreationDialog";

export default function TenantsManager() {
  const { t } = useI18n();
  const [tenant, setTenant] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const list = await base44.entities.Tenant.list("-created_date", 100);
      setTenants(list);
      if (list.length > 0) {
        setTenant(list[0]);
        setEditing(list[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    await base44.entities.Tenant.update(editing.id, editing);
    setTenant(editing);
    setSaving(false);
  }

  async function handleCreateNew(data) {
    const newTenant = await base44.entities.Tenant.create(data);
    setTenants((prev) => [newTenant, ...prev]);
    setTenant(newTenant);
    setEditing(newTenant);
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
          <h1 className="font-heading font-black text-2xl tracking-tight">{t("tenantsLabel")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tenants.length} {tenants.length === 1 ? "servis" : "servisů"}</p>
          </div>
          <div className="flex gap-2">
          

          
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
            <Save className="h-4 w-4" /> {saving ? "Ukládám..." : "Uložit"}
          </Button>
          </div>
      </div>

      {editing && (
        <div className="p-5 mb-6 border border-primary/30 rounded bg-secondary/20">
          <h3 className="font-heading font-semibold text-sm mb-4">{editing.brand_name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-mono">{t("domainLabel")}</Label>
              <Input
              value={editing.domain}
              onChange={(e) => setEditing({ ...editing, domain: e.target.value })}
              placeholder="autoservis-praha.cz"
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("brandNameLabel")}</Label>
              <Input
              value={editing.brand_name}
              onChange={(e) => setEditing({ ...editing, brand_name: e.target.value })}
              placeholder="AutoServis Praha"
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("logoUrlLabel")}</Label>
              <Input
              value={editing.logo_url || ""}
              onChange={(e) => setEditing({ ...editing, logo_url: e.target.value })}
              placeholder="https://..."
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("country")}</Label>
              <Input
              value={editing.country || ""}
              onChange={(e) => setEditing({ ...editing, country: e.target.value })}
              placeholder="Česká republika"
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("cityLabel")}</Label>
              <Input
              value={editing.city || ""}
              onChange={(e) => setEditing({ ...editing, city: e.target.value })}
              placeholder="Praha"
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("addressLabel")}</Label>
              <Input
              value={editing.address || ""}
              onChange={(e) => setEditing({ ...editing, address: e.target.value })}
              placeholder="Ulice 123"
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("phoneLabel")}</Label>
              <Input
              value={editing.phone || ""}
              onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
              placeholder="+420..."
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("emailLabel")}</Label>
              <Input
              value={editing.email || ""}
              onChange={(e) => setEditing({ ...editing, email: e.target.value })}
              placeholder="info@..."
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("primaryColorLabel")}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                type="color"
                value={editing.primary_color || "#3b82f6"}
                onChange={(e) => setEditing({ ...editing, primary_color: e.target.value })}
                className="w-12 h-9 p-1" />
              
                <Input
                value={editing.primary_color || ""}
                onChange={(e) => setEditing({ ...editing, primary_color: e.target.value })}
                placeholder="#3b82f6"
                className="flex-1" />
              
              </div>
            </div>
            <div>
              <Label className="text-xs font-mono">{t("accentColorLabel")}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                type="color"
                value={editing.accent_color || "#f97316"}
                onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })}
                className="w-12 h-9 p-1" />
              
                <Input
                value={editing.accent_color || ""}
                onChange={(e) => setEditing({ ...editing, accent_color: e.target.value })}
                placeholder="#f97316"
                className="flex-1" />
              
              </div>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
              checked={editing.is_active !== false}
              onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
            
              <Label className="text-xs font-mono">{t("activeLabel")}</Label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-xs font-mono">{t("headingLabel")}</Label>
              <Input
              value={editing.heading || ""}
              onChange={(e) => setEditing({ ...editing, heading: e.target.value })}
              placeholder="Přesnost v každém detailu"
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("subheadingLabel")}</Label>
              <Input
              value={editing.subheading || ""}
              onChange={(e) => setEditing({ ...editing, subheading: e.target.value })}
              placeholder="Profesionální autoservis v srdci města"
              className="mt-1" />
            
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs font-mono">{t("footerTextLabel")}</Label>
              <Textarea
              value={editing.footer_text || ""}
              onChange={(e) => setEditing({ ...editing, footer_text: e.target.value })}
              rows={2}
              placeholder="Jsme tu pro vás od roku 2005..."
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("defaultMetaTitleLabel")}</Label>
              <Input
              value={editing.default_meta_title || ""}
              onChange={(e) => setEditing({ ...editing, default_meta_title: e.target.value })}
              className="mt-1" />
            
            </div>
            <div>
              <Label className="text-xs font-mono">{t("defaultMetaDescriptionLabel")}</Label>
              <Textarea
              value={editing.default_meta_description || ""}
              onChange={(e) => setEditing({ ...editing, default_meta_description: e.target.value })}
              rows={2}
              className="mt-1" />
            
            </div>
          </div>
        </div>
      )}

      <Button
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="gap-1"
      >
        <Plus className="h-4 w-4" /> {t("newService")}
      </Button>

      <TenantCreationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateNew}
      />
    </div>
  );
}