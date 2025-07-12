import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('welcomeTitle')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{t('welcomeMessage')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link to="/gps-marker-mode">
          <Button className="w-full min-h-24 text-lg p-6 flex items-center justify-center gap-3 whitespace-normal text-center">
            <span>📍</span>
            <span>{t('gpsMarkerMode')}</span>
          </Button>
        </Link>
        
        <Link to="/walking-mode">
          <Button className="w-full min-h-24 text-lg p-6 flex items-center justify-center gap-3 whitespace-normal text-center" variant="outline">
            <span>🚶</span>
            <span>{t('walkingMode')}</span>
          </Button>
        </Link>
        
        <Link to="/manual-input-mode">
          <Button className="w-full min-h-24 text-lg p-6 flex items-center justify-center gap-3 whitespace-normal text-center" variant="outline">
            <span>✏️</span>
            <span>{t('manualInputMode')}</span>
          </Button>
        </Link>
        
        <Link to="/measurement-history">
          <Button className="w-full min-h-24 text-lg p-6 flex items-center justify-center gap-3 whitespace-normal text-center" variant="outline">
            <span>📋</span>
            <span>{t('measurementHistory')}</span>
          </Button>
        </Link>
        
        <Link to="/settings">
          <Button className="w-full min-h-24 text-lg p-6 flex items-center justify-center gap-3 whitespace-normal text-center" variant="outline">
            <span>⚙️</span>
            <span>{t('settings')}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;