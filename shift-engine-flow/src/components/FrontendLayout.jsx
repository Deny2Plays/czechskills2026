import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import HUDNav from "./HUDNav";
import Footer from "./Footer";
import TenantSelector from "./TenantSelector";
import { setActiveTenant } from "../lib/tenantContext";

export default function FrontendLayout() {
  const [tenant, setTenant] = useState(null);
  const [allTenants, setAllTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTenants() {
      const tenants = await base44.entities.Tenant.filter({ is_active: true }, "-created_date");
      setAllTenants(tenants);
      // Check if user already selected a tenant this session
      const savedId = sessionStorage.getItem("shift_cms_frontend_tenant");
      const saved = tenants.find((t) => t.id === savedId);
      if (saved) {
        setTenant(saved);
        setActiveTenant(saved);
      } else if (tenants.length === 1) {
        // Auto-select if only one tenant
        setTenant(tenants[0]);
        setActiveTenant(tenants[0]);
        sessionStorage.setItem("shift_cms_frontend_tenant", tenants[0].id);
      }
      setLoading(false);
    }
    loadTenants();
  }, []);

  function handleSelectTenant(t) {
    setTenant(t);
    setActiveTenant(t);
    sessionStorage.setItem("shift_cms_frontend_tenant", t.id);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-muted-foreground">NAČÍTÁNÍ...</span>
        </div>
      </div>
    );
  }

  // Show tenant picker if multiple tenants and none selected
  if (!tenant && allTenants.length > 1) {
    return <TenantSelector tenants={allTenants} onSelect={handleSelectTenant} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HUDNav tenant={tenant} onChangeTenant={allTenants.length > 1 ? () => { sessionStorage.removeItem("shift_cms_frontend_tenant"); setTenant(null); } : null} />
      <main className="flex-1 pt-14">
        <Outlet context={{ tenant }} />
      </main>
      <Footer tenant={tenant} />
    </div>
  );
}