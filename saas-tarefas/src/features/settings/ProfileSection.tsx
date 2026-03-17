import { mockUser } from "@/data/mock";

export function ProfileSection() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-6">
      <h2 className="text-sm font-semibold text-text-primary mb-4">Profile</h2>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white text-xl font-bold">
          {mockUser.avatarInitials}
        </div>
        <div>
          <p className="text-base font-semibold text-text-primary">{mockUser.name}</p>
          <p className="text-sm text-text-muted">{mockUser.email}</p>
        </div>
      </div>
    </div>
  );
}
