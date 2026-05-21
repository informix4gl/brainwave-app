import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, ThemeProvider } from "./i18n";
import { BrainSyncProvider } from "./context/BrainSyncContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSkeleton from "./components/LoadingSkeleton";
import AppLayout from "./components/layout/AppLayout";
import NotFoundPage from "./pages/NotFoundPage";

const GeneratePage = lazy(() => import("./pages/GeneratePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrainSyncProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Suspense fallback={<LoadingSkeleton />}>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index element={<GeneratePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ErrorBoundary>
        </BrainSyncProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
