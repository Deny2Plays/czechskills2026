import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Globe, ArrowRight, Wrench } from "lucide-react";
import { useI18n } from "../lib/i18n";
import LangSwitcher from "./LangSwitcher";

export default function TenantSelector({ tenants, onSelect }) {
  const { t } = useI18n();
  const [selectedCountry, setSelectedCountry] = React.useState("");
  
  const countries = Array.from(new Set(tenants.map(t => t.country).filter(Boolean)));
  const filteredTenants = selectedCountry ? tenants.filter(t => t.country === selectedCountry) : tenants;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="absolute top-4 right-4">
        <LangSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <p className="text-xs font-mono text-primary uppercase tracking-[0.3em] mb-2">SHIFT-CMS</p>
          <h1 className="font-heading font-black text-3xl md:text-4xl tracking-tight mb-2">
            {t("selectService")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("selectServiceDesc")}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">{t("country")}:</span>
          <select
            value={selectedCountry || ""}
            onChange={(e) => setSelectedCountry(e.target.value || "")}
            className="text-xs bg-secondary border border-border rounded px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">{t("allCountries")}</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTenants.length === 0 ? (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
              {t("noServicesForCountry")}
            </div>
          ) : filteredTenants.map((tenant, i) => (
            <motion.button
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => onSelect(tenant)}
              className="group text-left p-5 border border-border rounded-lg hover:border-primary/40 hover:bg-secondary/30 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                {tenant.logo_url ? (
                  <img src={tenant.logo_url} alt={tenant.brand_name} className="h-10 w-10 rounded object-contain flex-shrink-0" />
                ) : (
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-heading font-bold text-base leading-tight group-hover:text-primary transition-colors">
                    {tenant.brand_name}
                  </div>
                  <div className="text-xs font-mono text-chrome mt-0.5">{tenant.domain}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                {tenant.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-primary flex-shrink-0" />
                    {tenant.address || tenant.city}
                  </span>
                )}
                {tenant.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-primary flex-shrink-0" />
                    {tenant.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 mt-4 text-xs font-mono text-primary">
                {t("select")} <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}