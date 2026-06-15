import { Bell, Globe, Lock, Palette, Save } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { cn } from '@/shared/lib/utils';

interface SettingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingCard({ icon, title, description, children }: SettingCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mb-3 text-xs text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">
            Manage your preferences and account settings.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Appearance */}
        <SettingCard
          icon={<Palette className="h-5 w-5 text-primary" />}
          title="Appearance"
          description="Customize the look and feel of the portal."
        >
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={cn(
                'rounded-xl border px-4 py-2 text-sm font-medium transition-smooth',
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              Light
            </button>
            <button
              onClick={toggleTheme}
              className={cn(
                'rounded-xl border px-4 py-2 text-sm font-medium transition-smooth',
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              Dark
            </button>
          </div>
        </SettingCard>

        {/* Notifications */}
        <SettingCard
          icon={<Bell className="h-5 w-5 text-primary" />}
          title="Notifications"
          description="Configure how you receive alerts and updates."
        >
          <div className="space-y-3">
            {['Email notifications', 'Push notifications', 'Weekly digest'].map(
              (item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  {item}
                </label>
              ),
            )}
          </div>
        </SettingCard>

        {/* Language */}
        <SettingCard
          icon={<Globe className="h-5 w-5 text-primary" />}
          title="Language & Region"
          description="Set your preferred language and timezone."
        >
          <select className="h-10 w-full max-w-xs rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </SettingCard>

        {/* Security */}
        <SettingCard
          icon={<Lock className="h-5 w-5 text-primary" />}
          title="Security"
          description="Manage your security and authentication settings."
        >
          <button className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-accent/50">
            Change Password
          </button>
        </SettingCard>
      </div>
    </div>
  );
}
