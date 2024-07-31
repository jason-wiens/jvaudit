import { AdminStateProvider } from "@/contexts/admin-state.provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminStateProvider>{children}</AdminStateProvider>;
}
