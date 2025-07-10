import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full"> {/* Removed min-h-screen and bg/text colors as Layout handles it */}
      {/* ThemeToggle is now in Layout, remove from here */}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('welcomeTitle')}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{t('welcomeMessage')}</p>
      </div>

      {/* Navigation buttons are now in the sidebar, remove from here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Removed direct Link buttons as navigation is handled by sidebar */}
        <p className="text-center text-gray-500 dark:text-gray-400">
          {t('welcomeMessage')}
        </p>
      </div>
      {/* MadeWithDyad is now in Layout, remove from here */}
    </div>
  );
};

export default Index;