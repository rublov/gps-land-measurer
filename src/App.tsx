import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gps-marker-mode" element={<GpsMarkerMode />} />
          <Route path="/walking-mode" element={<WalkingMode />} />
          <Route path="/manual-input-mode" element={<ManualInputMode />} />
          <Route path="/measurement-history" element={<MeasurementHistory />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;