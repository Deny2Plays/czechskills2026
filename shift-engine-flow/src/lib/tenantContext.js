// Simple tenant context for multi-tenant resolution
// In production, this would be resolved from the domain
// For demo, we use the first active tenant

let cachedTenant = null;
let cachedTenantId = null;

export function setActiveTenant(tenant) {
  cachedTenant = tenant;
  cachedTenantId = tenant?.id;
}

export function getActiveTenant() {
  return cachedTenant;
}

export function getActiveTenantId() {
  return cachedTenantId;
}