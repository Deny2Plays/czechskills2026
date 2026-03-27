import { Link } from "react-router-dom";
import { Wrench, MapPin, Phone, Mail } from "lucide-react";
import { useI18n } from "../lib/i18n";

export default function Footer({ tenant }) {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              {tenant?.logo_url ? (
                <img src={tenant.logo_url} alt={tenant.brand_name} className="h-8 w-8 rounded object-contain" />
              ) : (
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <span className="font-heading font-bold text-sm">
                {tenant?.brand_name || "SHIFT-CMS"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              {tenant?.footer_text || "Profesionální autoservisní platforma s důrazem na kvalitu, transparentnost a moderní technologie."}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {t("navigation")}
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/blog" className="text-sm hover:text-primary transition-colors">Blog</Link>
              <Link to="/faq" className="text-sm hover:text-primary transition-colors">FAQ</Link>
              <Link to="/admin" className="text-sm hover:text-primary transition-colors">{t("administration")}</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              {t("contact")}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {tenant?.address && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {tenant.address}
                </span>
              )}
              {tenant?.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {tenant.phone}
                </span>
              )}
              {tenant?.email && (
                <span className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {tenant.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted-foreground">
            © {new Date().getFullYear()} {tenant?.brand_name || "SHIFT-CMS"}. {t("allRightsReserved")}
          </p>
          <p className="text-xs font-mono text-chrome">
            Powered by SHIFT-CMS · Multi-Tenant Platform
          </p>
        </div>
      </div>
    </footer>
  );
}