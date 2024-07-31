export type AppRouteParams = {
  auditId?: string;
  companyId?: string;
  userId?: string;
};

export class AppRoutes {
  static HomePage = () => "/";
  static LoginPage = () => "/auth/login";
  static ContactUsPage = () => "/contact";

  static Dashboard = () => "/app/dashboard";
  static Audits = () => "/app/audits";

  static GeneralInfo = (params: AppRouteParams) =>
    `/app/audits/${params.auditId || "noAuditId"}/general`;
  static AuditIRs = (params: AppRouteParams) =>
    `/app/audits/${params.auditId || "noAuditId"}/irs`;
  static AuditQueries = (params: AppRouteParams) =>
    `/app/audits/${params.auditId || "noAuditId"}/queries`;
  static AuditReport = (params: AppRouteParams) =>
    `/app/audits/${params.auditId || "noAuditId"}/report`;
  static AuditResponses = (params: AppRouteParams) =>
    `/app/audits/${params.auditId || "noAuditId"}/responses`;

  static AdminDashboard = () => "/admin/dashboard";

  static AdminAudits = () => "/admin/audits";
  static AdminAudit = (params: AppRouteParams) =>
    `/admin/audits/${params.auditId || "noAuditId"}`;

  static AdminCompanies = () => "/admin/companies";
  static AdminCompany = (params: AppRouteParams) =>
    `/admin/companies/${params.companyId || "noCompanyId"}`;

  static AdminUsers = () => "/admin/users";
  static AdminUser = (params: AppRouteParams) =>
    `/admin/users/${params.userId || "noUserId"}`;

  static Forbidden = () => "/app/forbidden";
  static NotFound = () => "/app/not-found";

  static Settings = () => "/app/settings";
}
