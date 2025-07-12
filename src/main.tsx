import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./globals.css";
import "./i18n";
import App from "./App";

// Function to hide the splash screen
const hideSplashScreen = () => {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.remove();
  }
};

// Hide splash and render app
hideSplashScreen();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);