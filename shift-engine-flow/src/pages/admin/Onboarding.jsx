import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Wrench, Building2, Globe, MapPin, Phone, Mail } from "lucide-react";

function slugify(str) {
  return str.toLowerCase()
    .replace(/[áäà]/g, "a").replace(/[čç]/g, "c").replace(/[ď]/g, "d")
    .replace(/[éěë]/g, "e").replace(/[íï]/g, "i").replace(/[ňñ]/g, "n")
    .replace(/[óöô]/g, "o").replace(/[řŕ]/g, "r").replace(/[šś]/g, "s")
    .replace(/[ťţ]/g, "t").replace(/[úůüù]/g, "u").replace(/[ýÿ]/g, "y")
    .replace(/[žź]/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    brand_name: "",
    domain: "",
    city: "",
    address: "",
    phone: "",
    email: "",
  });

  function set(key, value) {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      if (key === "brand_name") {
        updated.domain = slugify(value) + ".cz";
      }
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.brand_name || !form.domain) return;
    setLoading(true);
    const tenant = await base44.entities.Tenant.create({
      ...form,
      is_active: true,
    });
    localStorage.setItem("shift_cms_active_tenant", tenant.id);
    onComplete(tenant);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>

        <h1 className="font-heading font-black text-2xl text-center mb-1">Vítejte v SHIFT-CMS</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Nastavte svůj autoservis — zabere to jen minutu.
        </p>

        <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
              Název autoservisu *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.brand_name}
                onChange={(e) => set("brand_name", e.target.value)}
                placeholder="Autoservis Praha s.r.o."
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
              Doména *
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.domain}
                onChange={(e) => set("domain", e.target.value)}
                placeholder="autoservis-praha.cz"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
              Město
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Praha"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
              Adresa
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Náměstí Míru 1, 120 00 Praha"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+420 777 000 000"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="info@servis.cz"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded bg-background focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.brand_name || !form.domain}
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Zakládám autoservis..." : "Vytvořit autoservis a pokračovat →"}
          </button>
        </form>
      </div>
    </div>
  );
}