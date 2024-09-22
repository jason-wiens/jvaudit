import { getTenantDbQuery } from "./actions/get-tenant";

export type Tenant = NonNullable<Awaited<ReturnType<typeof getTenantDbQuery>>>;

export type ITenantContext = {
  tenant: Tenant;
};
