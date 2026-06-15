import { useState } from 'react';
import { Moon, Sun, Monitor, Shield, Bell, Mail, Newspaper, Trash2, ChevronRight } from 'lucide-react';
import { useSettings } from '@/features/settings/hooks/useSettings';

/* ─────────────────────────── Toggle Switch ─────────────────────────── */

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3 group">
      <div className="min-w-0 mr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-smooth focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2 focus:ring-offset-background ${
          enabled ? 'bg-primary' : 'bg-muted-foreground/30'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ring-0 transition-smooth ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

/* ─────────────────────────── Section Card ─────────────────────────── */

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  danger?: boolean;
}

function SectionCard({ title, description, children, className = '', danger = false }: SectionCardProps) {
  return (
    <div className={`glass rounded-xl overflow-hidden ${danger ? 'ring-1 ring-destructive/30' : ''} ${className}`}>
      <div className={`px-6 py-5 border-b ${danger ? 'border-destructive/20' : 'border-border/50'}`}>
        <h2 className={`text-base font-semibold ${danger ? 'text-destructive' : 'text-foreground'}`}>{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ─────────────────────────── Settings Page ─────────────────────────── */

export default function SettingsPage() {
  const {
    theme,
    sidebarPosition,
    emailNotifications,
    pushNotifications,
    weeklyDigest,
    setTheme,
    setSidebarPosition,
    setEmailNotifications,
    setPushNotifications,
    setWeeklyDigest,
  } = useSettings();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const themeOptions: Array<{ value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }> = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your account preferences and configurations.
        </p>
      </div>

      {/* ── Profile Section ── */}
      <SectionCard title="Profile" description="Your personal information from Azure AD">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white shadow-lg flex-shrink-0">
            SK
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">Sekhar Kumar</h3>
            <p className="text-sm text-muted-foreground">sekhar.kumar@company.com</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                Administrator
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
            <p className="text-sm text-foreground mt-1">Engineering</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
            <p className="text-sm text-foreground mt-1">San Francisco, CA</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Appearance Section ── */}
      <SectionCard title="Appearance" description="Customize how the portal looks for you">
        {/* Theme toggle */}
        <div className="mb-5">
          <p className="text-sm font-medium text-foreground mb-3">Theme</p>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-smooth border ${
                  theme === opt.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme preview */}
        <div className="mb-5">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className={`flex items-center gap-3 rounded-lg border border-border/50 p-3 ${theme === 'light' ? 'bg-white text-gray-900' : theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-r from-white to-gray-900'}`}>
            <div className="h-8 w-8 rounded-md bg-blue-500" />
            <div className="space-y-1 flex-1">
              <div className={`h-2 w-24 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-600'}`} />
              <div className={`h-2 w-16 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
            </div>
          </div>
        </div>

        {/* Sidebar position */}
        <div className="border-t border-border/50 pt-5">
          <p className="text-sm font-medium text-foreground mb-3">Sidebar Position</p>
          <div className="flex gap-2">
            {(['left', 'right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setSidebarPosition(pos)}
                className={`flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-smooth border capitalize ${
                  sidebarPosition === pos
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-background text-foreground border-input hover:bg-accent'
                }`}
              >
                <ChevronRight className={`h-4 w-4 ${pos === 'left' ? 'rotate-180' : ''}`} />
                {pos}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Notifications Section ── */}
      <SectionCard title="Notifications" description="Choose how you want to be notified">
        <div className="divide-y divide-border/50">
          <ToggleSwitch
            enabled={emailNotifications}
            onChange={setEmailNotifications}
            label="Email Notifications"
            description="Receive email alerts for important updates"
          />
          <ToggleSwitch
            enabled={pushNotifications}
            onChange={setPushNotifications}
            label="Push Notifications"
            description="Get push notifications in your browser"
          />
          <ToggleSwitch
            enabled={weeklyDigest}
            onChange={setWeeklyDigest}
            label="Weekly Digest"
            description="Receive a weekly summary of activity"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Email: {emailNotifications ? 'On' : 'Off'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Push: {pushNotifications ? 'On' : 'Off'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span>Digest: {weeklyDigest ? 'On' : 'Off'}</span>
          </div>
        </div>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard title="Danger Zone" description="Irreversible and destructive actions" danger>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently remove your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-smooth shadow-sm flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20 animate-fade-in">
            <p className="text-sm text-destructive font-medium mb-2">
              Are you sure you want to delete your account?
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              This will permanently erase all your data, projects, and team associations.
              This action is <span className="font-semibold text-destructive">irreversible</span>.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="h-9 px-4 rounded-lg border border-input bg-background text-sm font-medium text-foreground hover:bg-accent transition-smooth"
              >
                Cancel
              </button>
              <button className="h-9 px-4 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-smooth">
                Yes, delete my account
              </button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
