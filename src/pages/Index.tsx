import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ObjectivesSection from "@/components/sections/ObjectivesSection";
import CollaboratorsSection from "@/components/sections/CollaboratorsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import JoinSection from "@/components/sections/JoinSection";

interface ObjectivesData {
  hero: {
    title: string;
    subtitle: string;
    buttons: Array<{
      label: string;
      variant: "primary" | "secondary";
      action: "scroll" | "link";
      target: string;
      icon?: string;
    }>;
  };
  core: {
    title: string;
    subtitle: string;
    objectives: Array<{
      id: string;
      label: string;
      theme: "research" | "education" | "development";
      points: string[];
    }>;
  };
}

const Index = () => {
  const [data, setData] = useState<ObjectivesData | null>(null);

  useEffect(() => {
    fetch(asset("data/objectives.json"))
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Handle hash scrolling on page load
  useEffect(() => {
    if (data) {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero {...data.hero} />
        <ObjectivesSection {...data.core} />
        <ProjectsSection />
        <CollaboratorsSection />
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
