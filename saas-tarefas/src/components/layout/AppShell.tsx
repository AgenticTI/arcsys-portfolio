import { Sidebar } from "./Sidebar";
import { MobileTopBar } from "./MobileTopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-bg-app">
      <MobileTopBar />
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
