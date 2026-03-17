import { ProfileSection } from "@/features/settings/ProfileSection";
import { PreferencesSection } from "@/features/settings/PreferencesSection";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile and preferences.</p>
      </div>

      <div className="space-y-4">
        <ProfileSection />
        <PreferencesSection />
      </div>
    </div>
  );
}
