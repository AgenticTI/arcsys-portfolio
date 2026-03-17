import { mockUser } from "@/data/mock";

export function ProfileSection() {
  return (
    <div className="bg-bg-card rounded-[20px] border border-border p-6 shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
      <h2 className="font-display text-[15px] font-bold text-text-primary mb-5">Profile</h2>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3A3010] to-[#5A4820] border-2 border-accent-dim flex items-center justify-center font-display text-xl font-bold text-accent">
          {mockUser.avatarInitials.toUpperCase()}
        </div>
        <div>
          <p className="text-[17px] font-semibold text-text-primary">{mockUser.name}</p>
          <p className="text-[14px] text-text-muted mt-0.5">{mockUser.email}</p>
        </div>
      </div>
    </div>
  );
}
