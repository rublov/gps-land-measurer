import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Прямые импорты без ленивой загрузки
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GpsMarkerMode from "./pages/GpsMarkerMode";
import WalkingMode from "./pages/WalkingMode";
import ManualInputMode from "./pages/ManualInputMode";
import MeasurementHistory from "./pages/MeasurementHistory";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="gps-marker" element={<GpsMarkerMode />} />
            <Route path="walking" element={<WalkingMode />} />
            <Route path="manual" element={<ManualInputMode />} />
            <Route path="history" element={<MeasurementHistory />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
