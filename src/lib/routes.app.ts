export enum AppRoutes {
  // Public Routes
  HomePage = "/",
  LoginPage = "/auth/login",
  ContactUsPage = "/contact",

  // User Routes

  // Main
  Dashboard = "/app/main/dashboard",
  Audits = "/app/main/audits",
  IRs = "/app/main/irs",
  Queries = "/app/main/queries",

  // Audit Routes
  GeneralInfo = "/app/audits/:auditId/general",
  AuditIRs = "/app/audits/:auditId/irs",
  AuditQueries = "/app/audits/:auditId/queries",
  AuditReport = "/app/audits/:auditId/report",

  // Admin Routes
  AdminDashboard = "/admin/dashboard",
  AdminAudits = "/admin/audits",
  AddAudit = "/admin/audits/add",
  EditAudit = "/admin/audits/:auditId/edit",
  AdminCompanies = "/admin/companies",
  AddCompany = "/admin/companies/add",
  EditCompany = "/admin/companies/:companyId/edit",
  AdminUsers = "/admin/users",
  AddUser = "/admin/users/add",
  EditUser = "/admin/users/:userId/edit",
  AdminPeople = "/admin/contacts",
  AddPerson = "/admin/contacts/add",
  EditPerson = "/admin/contacts/:personId/edit",

  // Error Routes
  Forbidden = "/app/forbidden",
  NotFound = "/app/not-found",

  // Settings Routes
  Settings = "/app/settings",
}
