import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, FileText, HelpCircle, FolderOpen, Tags,
  Globe, ArrowLeftRight, ChevronLeft, Wrench, ChevronDown, Check, LogOut, Plus
} from "lucide-react";
import AdminAuthGate from "./AdminAuthGate";
import LangSwitcher from "./LangSwitcher";
import { useI18n } from "../lib/i18n";
import { useAuth } from "../lib/AuthContext";

const adminNavConfig = [
  { labelKey: "dashboardLabel", href: "/admin", icon: LayoutDashboard },
  { labelKey: "postsLabel", href: "/admin/posts", icon: FileText },
  { labelKey: "faqLabel", href: "/admin/faq", icon: HelpCircle },
  { labelKey: "categoriesLabel", href: "/admin/categories", icon: FolderOpen },
  { labelKey: "tagsLabel", href: "/admin/tags", icon: Tags },
  { labelKey: "redirectsLabel", href: "/admin/redirects", icon: ArrowLeftRight },
  { labelKey: "tenantsLabel", href: "/admin/tenants", icon: Globe },
];

export default function AdminLayout() {
  const location = useLocation();
  const { t } = useI18n();
  const { user: currentUser } = useAuth();
  const adminNav = adminNavConfig.map(item => ({ ...item, label: t(item.labelKey) }));
  const [tenantData, setTenantData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shift_cms_active_tenant_data") || "{}"); }
    catch { return {}; }
  });
  const [allTenants, setAllTenants] = useState(() => {
    try { return JSON.parse(localStorage.getItem("shift_cms_all_tenants") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    function reload() {
      try {
        const data = JSON.parse(localStorage.getItem("shift_cms_active_tenant_data") || "{}");
        setTenantData(data);
        const all = JSON.parse(localStorage.getItem("shift_cms_all_tenants") || "[]");
        setAllTenants(all);
      } catch {}
    }
    reload();
    window.addEventListener("tenant-loaded", reload);
    return () => window.removeEventListener("tenant-loaded", reload);
  }, [location.pathname]);

  function handleSwitchTenant(t) {
    localStorage.setItem("shift_cms_active_tenant", t.id);
    localStorage.setItem("shift_cms_active_tenant_data", JSON.stringify(t));
    setTenantData(t);
    window.location.reload();
  }

  function handleLogout() {
    localStorage.removeItem("shift_cms_active_tenant");
    localStorage.removeItem("shift_cms_active_tenant_data");
    base44.auth.logout("/");
  }

  return (
    <AdminAuthGate>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen sticky top-0">
          <div className="p-4 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center gap-2">
              {tenantData.logo_url ? (
                <img src={tenantData.logo_url} alt="logo" className="h-7 w-7 rounded object-contain bg-white" />
              ) : (
                <div className="h-7 w-7 rounded bg-sidebar-primary flex items-center justify-center">
                  <Wrench className="h-3.5 w-3.5 text-sidebar-primary-foreground" />
                </div>
              )}
              <span className="font-heading font-bold text-sm">{tenantData.brand_name || "SHIFT-CMS"}</span>
            </Link>
          </div>

          {allTenants.length > 1 && (
            <div className="px-3 py-2 border-b border-sidebar-border">
              <p className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-wider mb-1">{t("selectedService")}</p>
              <select
                value={tenantData.id || ""}
                onChange={(e) => {
                  const t = allTenants.find((x) => x.id === e.target.value);
                  if (t) handleSwitchTenant(t);
                }}
                className="w-full bg-sidebar-accent text-sidebar-foreground text-xs rounded px-2 py-1.5 border border-sidebar-border focus:outline-none"
              >
                {allTenants.map((t) => (
                  <option key={t.id} value={t.id}>{t.brand_name}</option>
                ))}
              </select>
            </div>
          )}
          <nav className="flex-1 p-3 space-y-0.5">
            {adminNav.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/admin" && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-3 border-t border-sidebar-border">
            <Link
              to="/admin/tenants"
              className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors w-full justify-center"
            >
              <Globe className="h-4 w-4" />
              {t("newService")}
            </Link>
          </div>

          <div className="p-3 border-t border-sidebar-border space-y-2">
            <div className="px-3 py-2 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-sidebar-foreground/70 truncate">{currentUser?.full_name}</span>
              <LangSwitcher className="sidebar text-[10px]" />
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors rounded"
            >
              <ChevronLeft className="h-3 w-3" />
              {t("backToWeb")}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/50 hover:text-red-400 transition-colors rounded w-full text-left"
            >
              <LogOut className="h-3 w-3" />
              {t("logout")}
            </button>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-sidebar border-b border-sidebar-border flex items-center px-4 gap-3 overflow-x-auto">
          <Link to="/admin" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-6 w-6 rounded bg-sidebar-primary flex items-center justify-center">
              <Wrench className="h-3 w-3 text-sidebar-primary-foreground" />
            </div>
          </Link>
          {adminNav.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`text-xs whitespace-nowrap px-2 py-1 rounded flex-shrink-0 ${
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Main */}
        <main className="flex-1 bg-background md:pt-0 pt-12">
          <div className="max-w-[1200px] mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminAuthGate>
  );
}