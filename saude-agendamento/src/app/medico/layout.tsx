import { DoctorSidebar } from "@/components/DoctorSidebar";
import doctorUser from "@/data/doctor-user.json";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden bg-dark-bg px-4 py-3 border-b border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1D23" strokeWidth="2.5">
                <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 002-2V5a2 2 0 00-2-2H4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Dashboard</p>
              <p className="text-[9px] text-neutral-500">{doctorUser.name}</p>
            </div>
          </div>
          <img
            src={doctorUser.photo}
            alt={doctorUser.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-primary"
          />
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
