import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, MapPin, Footprints, Calculator, History, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { MadeWithDyad } from './made-with-dyad';
import { useIsMobile } from '@/hooks/use-mobile'; // Import the hook

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Open by default on desktop, closed on mobile
  const location = useLocation(); // To close sidebar on navigation

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Keep sidebar open on desktop if it was opened, close on mobile
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-[1000] bg-background/80 backdrop-blur-sm rounded-md"
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-[999] w-64 transform transition-transform ease-in-out duration-300' : 'relative w-64'}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isMobile ? 'translate-x-0' : ''}
          bg-sidebar dark:bg-sidebar-background border-r border-sidebar-border dark:border-sidebar-border p-4 flex flex-col shadow-lg
        `}
      >
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
              <Footprints className="mr-3 h-5 w-5" />
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

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This is where the routed components will be rendered */}
      </main>
    </div>
  );
};

export default Layout;