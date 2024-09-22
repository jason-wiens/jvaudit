import {
  Audit,
  Company,
  InformationRequest,
  Tenant,
  Workspace,
} from "@prisma/client";

export class AppRoutes {
  // public routes
  static HomePage = () => "/";
  static LoginPage = () => "/auth/login";
  static ChangePassword = () => "/auth/change-password";
  static ContactUsPage = () => "/contact";
  static AppPage = () => "/app";

  // super user routes
  static SuperUserDashboard = () => "/app/su/dashboard";
  static SuperUserTenants = () => "/app/su/tenants";
  static SuperUserTenant = (params: { tenantId: Tenant["tenantId"] }) =>
    `/app/su/tenants/${params.tenantId}`;
  static SuperUserBilling = () => "/app/su/billing";

  // workspace routes
  static Dashboard = (params: { workspaceId: Workspace["workspaceId"] }) =>
    `/app/${params.workspaceId}/dashboard`;
  static Audits = (params: { workspaceId: Workspace["workspaceId"] }) =>
    `/app/${params.workspaceId}/audits`;
  static Audit = (params: {
    workspaceId: Workspace["workspaceId"];
    auditId: Audit["auditId"];
  }) => `/app/${params.workspaceId}/audits/${params.auditId}`;
  static InformationRequest = (params: {
    workspaceId: Workspace["workspaceId"];
    auditId: Audit["auditId"];
    irId: InformationRequest["irId"];
  }) => `/app/${params.workspaceId}audits/${params.auditId}/irs/${params.irId}`;
  static Query = (params: {
    workspaceId: Workspace["workspaceId"];
    auditId: Audit["auditId"];
    queryId: string;
  }) =>
    `/app/${params.workspaceId}/audits/${params.auditId}/queries/${params.queryId}`;
  static Response = (params: {
    workspaceId: Workspace["workspaceId"];
    auditId: Audit["auditId"];
    responseId: string;
  }) =>
    `/app/${params.workspaceId}/audits/${params.auditId}/queries/responses/${params.responseId}`;

  // admin routes
  static Companies = () => "/app/admin/companies";
  static Company = (params: { companyId: Company["companyId"] }) =>
    `/app/admin/companies/${params.companyId}`;
  static NotificatonSettings = () => "/app/admin/notification-settings";
  static Users = () => "/app/admin/users";
  static Templates = () => "/app/admin/templates";
  static Workspaces = () => "/app/admin/workspaces";

  // user routes
  static UserNotifications = () => "/app/user-notifications";
  static UserSettings = () => "/app/user-settings";

  // other routes
  static Forbidden = () => "/forbidden";
  static NotFound = () => "/not-found";
  static ServerError = () => "/server-error";
}
