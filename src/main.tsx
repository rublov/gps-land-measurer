import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./i18n"; // Import i18n configuration
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

// Function to hide the splash screen
const hideSplashScreen = () => {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.classList.add('fade-out');
    // Remove the element from the DOM after the fade-out transition
    setTimeout(() => {
      splashScreen.remove();
    }, 500); // Match the CSS transition duration
  }
};

// Render the React app
createRoot(document.getElementById("root")!).render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);

// Call hideSplashScreen after a short delay to ensure React app has time to render
// In a real app, this might be triggered by data loading completion
setTimeout(hideSplashScreen, 1000); // Show splash for at least 1 second