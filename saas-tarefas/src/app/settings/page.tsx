import { ProfileSection } from "@/features/settings/ProfileSection";
import { PreferencesSection } from "@/features/settings/PreferencesSection";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-6 gap-5 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-[34px] h-[34px] bg-accent-dim border border-accent-glow rounded-lg flex items-center justify-center text-accent">
          <Settings className="w-[17px] h-[17px]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
          Settings
        </h1>
      </div>
      <ProfileSection />
      <PreferencesSection />
    </div>
  );
}
