import { useState, useEffect } from "react";
import { asset } from "@/lib/asset";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Navigation {
  label: string;
  href: string;
  section?: string;
}

interface SiteConfig {
  site: {
    title: string;
    github: string;
  };
  navigation: Navigation[];
}

const Header = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(asset("data/site-config.json"))
      .then(res => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = config?.navigation.map(nav => nav.section).filter(Boolean) || [];
      
      for (const section of sections) {
        const element = document.getElementById(section!);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section!);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [config]);

  // Reusable scroll to section function
  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams();
    if (value) {
      params.set('search', value);
    }
    navigate(`/?${params.toString()}#projects`, { replace: true });
    
    // Scroll to projects section
    setTimeout(() => {
      const element = document.getElementById('projects');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (!config) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 font-heading font-semibold text-lg text-foreground hover:text-primary transition-all group"
          >
            <div className="relative">
              <img 
                src={asset("images/logo.png")} 
                alt="Digital Geosciences Logo" 
                className="w-9 h-9 object-contain transition-transform group-hover:scale-110"
              />
            </div>
            <span className="relative">
              {config.site.title}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 bg-muted/50 border-card-border focus:bg-background"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {config.navigation.map((nav) => (
              <button
                key={nav.section || nav.label}
                onClick={() => nav.section && scrollToSection(nav.section)}
                className={`
                  relative px-4 py-2 text-sm font-medium transition-all rounded-md
                  ${activeSection === nav.section 
                    ? 'text-primary bg-primary-muted' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                {nav.label}
                {activeSection === nav.section && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>

        </div>
      </div>
    </header>
  );
};

export default Header;