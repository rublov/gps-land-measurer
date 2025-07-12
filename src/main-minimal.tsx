import { createRoot } from "react-dom/client";
import App from "./App-minimal";

// Function to hide the splash screen
const hideSplashScreen = () => {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.remove();
  }
};

// Hide splash and render app
hideSplashScreen();

createRoot(document.getElementById("root")!).render(<App />);
