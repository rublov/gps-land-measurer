import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

// Ленивая загрузка страниц
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const GpsMarkerMode = lazy(() => import("./pages/GpsMarkerMode-simple"));
const WalkingMode = lazy(() => import("./pages/WalkingMode-simple"));
const ManualInputMode = lazy(() => import("./pages/ManualInputMode-simple"));
const MeasurementHistory = lazy(() => import("./pages/MeasurementHistory-simple"));
const Settings = lazy(() => import("./pages/Settings-simple"));

const queryClient = new QueryClient();

// Компонент загрузки
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Index />
                  </Suspense>
                } />
                <Route path="gps-marker-mode" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <GpsMarkerMode />
                  </Suspense>
                } />
                <Route path="walking-mode" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <WalkingMode />
                  </Suspense>
                } />
                <Route path="manual-input-mode" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ManualInputMode />
                  </Suspense>
                } />
                <Route path="measurement-history" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <MeasurementHistory />
                  </Suspense>
                } />
                <Route path="settings" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Settings />
                  </Suspense>
                } />
                <Route path="*" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotFound />
                  </Suspense>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </ErrorBoundary>
);

export default App;