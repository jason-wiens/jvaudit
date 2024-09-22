export type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
  submenu?: MenuItem[];
  disabled?: boolean;
  whyDisabled?: string;
};
