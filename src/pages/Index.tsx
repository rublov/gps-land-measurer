import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "@/components/ThemeToggle"; // Import ThemeToggle

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative"> {/* Added relative for positioning */}
      <ThemeToggle /> {/* Add ThemeToggle here */}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('welcomeTitle')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{t('welcomeMessage')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link to="/gps-marker-mode">
          <Button className="w-full h-24 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow">
            {t('gpsMarkerMode')}
          </Button>
        </Link>
        <Link to="/walking-mode">
          <Button className="w-full h-24 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow">
            {t('walkingMode')}
          </Button>
        </Link>
        <Link to="/manual-input-mode">
          <Button className="w-full h-24 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow">
            {t('manualInputMode')}
          </Button>
        </Link>
        <Link to="/measurement-history">
          <Button className="w-full h-24 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" variant="secondary">
            {t('measurementHistory')}
          </Button>
        </Link>
        <Link to="/settings">
          <Button className="w-full h-24 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow" variant="secondary">
            {t('settings')}
          </Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;