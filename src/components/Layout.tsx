import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, MapPin, Footprints, Calculator, History, Settings as SettingsIcon } from 'lucide-react'; // Changed Walk to Footprints
import ThemeToggle from './ThemeToggle';
import { MadeWithDyad } from './made-with-dyad';

const Layout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar dark:bg-sidebar-background border-r border-sidebar-border dark:border-sidebar-border p-4 flex flex-col shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-sidebar-foreground dark:text-sidebar-foreground">{t('appName')}</h2>
          <ThemeToggle />
        </div>
        <Separator className="mb-6 bg-sidebar-border dark:bg-sidebar-border" />
        <nav className="flex-grow space-y-2">
          <Link to="/" className="block">
            <Button variant="ghost" className="w-full justify-start text-lg text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground">
              <Home className="mr-3 h-5 w-5" />
              {t('home')}
            </Button>
          </Link>
          <Link to="/gps-marker-mode" className="block">
            <Button variant="ghost" className="w-full justify-start text-lg text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground">
              <MapPin className="mr-3 h-5 w-5" />
              {t('gpsMarkerMode')}
            </Button>
          </Link>
          <Link to="/walking-mode" className="block">
            <Button variant="ghost" className="w-full justify-start text-lg text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground">
              <Footprints className="mr-3 h-5 w-5" /> {/* Changed to Footprints */}
              {t('walkingMode')}
            </Button>
          </Link>
          <Link to="/manual-input-mode" className="block">
            <Button variant="ghost" className="w-full justify-start text-lg text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground">
              <Calculator className="mr-3 h-5 w-5" />
              {t('manualInputMode')}
            </Button>
          </Link>
          <Link to="/measurement-history" className="block">
            <Button variant="ghost" className="w-full justify-start text-lg text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground">
              <History className="mr-3 h-5 w-5" />
              {t('measurementHistory')}
            </Button>
          </Link>
          <Link to="/settings" className="block">
            <Button variant="ghost" className="w-full justify-start text-lg text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground">
              <SettingsIcon className="mr-3 h-5 w-5" />
              {t('settings')}
            </Button>
          </Link>
        </nav>
        <div className="mt-auto">
          <MadeWithDyad />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This is where the routed components will be rendered */}
      </main>
    </div>
  );
};

export default Layout;