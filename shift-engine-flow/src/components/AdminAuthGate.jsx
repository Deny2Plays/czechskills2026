import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import Onboarding from "../pages/admin/Onboarding";

export default function AdminAuthGate({ children }) {
  const [status, setStatus] = useState("loading"); // loading | onboarding | ready | denied
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    checkTenant();
  }, []);

  async function checkTenant() {
    // Check authentication first
    let me;
    try {
      me = await base44.auth.me();
    } catch (e) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    if (!me || !me.email) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }
    // Only allow logged-in users (not anonymous/public)
    const isAuthenticated = await base44.auth.isAuthenticated();
    if (!isAuthenticated) {
      base44.auth.redirectToLogin(window.location.pathname);
      return;
    }

    const tenants = await base44.entities.Tenant.list("-created_date", 100);
    if (tenants.length === 0) {
      setStatus("onboarding");
    } else {
      const savedId = localStorage.getItem("shift_cms_active_tenant");
      const active = tenants.find((t) => t.id === savedId) || tenants[0];
      localStorage.setItem("shift_cms_active_tenant", active.id);
      localStorage.setItem("shift_cms_active_tenant_data", JSON.stringify(active));
      localStorage.setItem("shift_cms_all_tenants", JSON.stringify(tenants));
      setTenant(active);
      setStatus("ready");
      window.dispatchEvent(new Event("tenant-loaded"));
    }
  }

  function handleOnboardingComplete(newTenant) {
    localStorage.setItem("shift_cms_active_tenant_data", JSON.stringify(newTenant));
    setTenant(newTenant);
    setStatus("ready");
  }

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return children;
}