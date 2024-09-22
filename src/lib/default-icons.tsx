import {
  Users,
  Building2,
  BellDot,
  LayoutPanelTop,
  Home,
  Table,
  Settings,
  Bell,
  LayoutDashboard,
  Castle,
  DollarSign,
  Layers3,
  Pencil,
  RefreshCw,
} from "lucide-react";

type IconProps = {
  size?: number;
  className?: string;
} | null;

export class DefaultIcons {
  static Users = (inputs: IconProps) => (
    <Users size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Companies = (inputs: IconProps) => (
    <Building2 size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static NotificationSettings = (inputs: IconProps) => (
    <BellDot size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Workspaces = (inputs: IconProps) => (
    <LayoutPanelTop
      size={inputs?.size || 16}
      className={inputs?.className || ""}
    />
  );
  static Workspace = (inputs: IconProps) => (
    <Layers3 size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Home = (inputs: IconProps) => (
    <Home size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Audits = (inputs: IconProps) => (
    <Table size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Settings = (inputs: IconProps) => (
    <Settings size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Notifications = (inputs: IconProps) => (
    <Bell size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Dashboard = (inputs: IconProps) => (
    <LayoutDashboard
      size={inputs?.size || 16}
      className={inputs?.className || ""}
    />
  );
  static Tenants = (inputs: IconProps) => (
    <Castle size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Billings = (inputs: IconProps) => (
    <DollarSign size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Edit = (inputs: IconProps) => (
    <Pencil size={inputs?.size || 16} className={inputs?.className || ""} />
  );
  static Pending = (inputs: IconProps) => (
    <RefreshCw size={inputs?.size || 16} className={inputs?.className || ""} />
  );
}
