import { useEffect, useState, useCallback } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
  Search, LayoutDashboard, TrendingUp, CreditCard, Calculator,
  Target, FileText, Settings, User, Crown, Plus, BarChart3,
  Sun, Moon, LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 rounded-2xl border-border bg-card shadow-2xl max-w-lg [&>button]:hidden">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Command.Input
              placeholder="Type a command or search..."
              className="flex h-12 w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[320px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages">
              {[
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: TrendingUp, label: 'Investments', path: '/investments' },
                { icon: CreditCard, label: 'Debt Advisor', path: '/debt' },
                { icon: Calculator, label: 'Calculators', path: '/calculators' },
                { icon: Target, label: 'Goals', path: '/goals' },
                { icon: FileText, label: 'Reports', path: '/reports' },
                { icon: Settings, label: 'Settings', path: '/settings' },
                { icon: User, label: 'Profile', path: '/profile' },
                { icon: Crown, label: 'Premium', path: '/premium' },
              ].map(({ icon: Icon, label, path }) => (
                <Command.Item
                  key={path}
                  value={label}
                  onSelect={() => runCommand(() => navigate(path))}
                  className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-border" />

            <Command.Group heading="Actions">
              <Command.Item
                value="Add Investment"
                onSelect={() => runCommand(() => navigate('/investments'))}
                className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                Add Investment
              </Command.Item>
              <Command.Item
                value="Set New Goal"
                onSelect={() => runCommand(() => navigate('/goals'))}
                className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Target className="h-4 w-4 text-muted-foreground" />
                Set New Goal
              </Command.Item>
              <Command.Item
                value="View Reports"
                onSelect={() => runCommand(() => navigate('/reports'))}
                className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                View Reports
              </Command.Item>
              <Command.Item
                value="Toggle Theme"
                onSelect={() => runCommand(toggleTheme)}
                className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
                Toggle Theme
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-border" />

            <Command.Group heading="Account">
              <Command.Item
                value="Profile"
                onSelect={() => runCommand(() => navigate('/profile'))}
                className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </Command.Item>
              <Command.Item
                value="Settings"
                onSelect={() => runCommand(() => navigate('/settings'))}
                className="flex items-center gap-2 rounded-lg text-sm text-foreground cursor-pointer data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Settings
              </Command.Item>
              <Command.Item
                value="Sign Out"
                onSelect={() => runCommand(async () => { await signOut(); navigate('/'); })}
                className="flex items-center gap-2 rounded-lg text-sm text-destructive cursor-pointer data-[selected=true]:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;
