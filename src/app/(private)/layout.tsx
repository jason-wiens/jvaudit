import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Alerts } from "@/components/alerts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full h-1">
      <Header />
      <div className="flex w-full h-full relative">
        <Alerts />
        <div className="w-56">
          <Sidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
