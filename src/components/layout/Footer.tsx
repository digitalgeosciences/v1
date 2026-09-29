import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { Mail, MapPin, ExternalLink } from "lucide-react";

interface SiteConfig {
  site: {
    title: string;
    contact: string;
    url: string;
    address: {
      city: string;
      postalCode: string;
      country: string;
    };
    github: string;
  };
}

const Footer = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch(asset("data/site-config.json"))
      .then(res => res.json())
      .then(setConfig)
      .catch(console.error);
  }, []);

  if (!config) return null;

  return (
    <footer className="border-t border-card-border bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>Contact Us</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-primary">{config.site.contact}</span>
              </div>
              <div className="pt-4 border-t border-card-border/50">
                <div className="flex items-center gap-3">
                  <img
                    src={asset("images/digitalgeosciencesQR.png")}
                    alt="QR code for WhatsApp updates"
                    className="h-20 w-20 rounded-xl border border-card-border bg-background/60 object-cover"
                  />
                  <div className="text-sm space-y-1">
                    <p className="text-foreground font-medium flex items-center gap-1">
                      <img
                        src={asset("images/whicon.png")}
                        alt="WhatsApp icon"
                        className="h-4 w-4 object-contain"
                      />
                      Scan or click below
                    </p>
                    <a
                      href="https://whatsapp.com/channel/0029VbBpbuX1noz2EzCsPy2C"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 hover:underline transition-colors"
                    >
                      Digital Geosciences updates
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Address</span>
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>{config.site.address.city}</div>
              <div>{config.site.address.postalCode}</div>
              <div>{config.site.address.country}</div>
            </div>
          </div>

          {/* Supporters */}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground mb-4">Supporters</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 group">
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <a
                  href="https://geoarabia.com/"
                  className="text-primary hover:text-primary/80 hover:underline transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Geoscience Arabia
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-card-border">
          <p className="leading-relaxed">
            © 2025-2026 {config.site.title}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
