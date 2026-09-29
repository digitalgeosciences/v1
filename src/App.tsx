import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GeoPrompts from "./pages/projects/GeoPrompts";
import GeoGallery from "./pages/projects/GeoGallery";
import ProjectsAndCollaborators from "./pages/ProjectsAndCollaborators";
import AnnouncementBar from "./components/layout/AnnouncementBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AnnouncementBar />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects/GeoPrompts" element={<GeoPrompts />} />
          <Route path="/projects/GeoGallery" element={<GeoGallery />} />
          <Route path="/projects-and-collaborators" element={<ProjectsAndCollaborators />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
