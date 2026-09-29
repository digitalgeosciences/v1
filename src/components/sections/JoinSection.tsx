import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { Link } from "react-router-dom";
import {
  UserPlus,
  CheckCircle,
  MessageCircle,
  Users,
  Link2,
} from "lucide-react";

interface JoinData {
  header: {
    title: string;
    subtitle: string;
  };
  eligibility: {
    title: string;
    description: string;
    requirements: string[];
  };
  cta: {
    title: string;
    description: string;
    whyTitle: string;
    highlights: string[];
    note: string;
    buttons: {
      startLabel: string;
      browseLabel: string;
    };
  };
}

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

const highlightIcons = [MessageCircle, Users, Link2];

const JoinSection = () => {
  const [data, setData] = useState<JoinData | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch(asset("data/join.json"))
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(asset("data/site-config.json"))
      .then((res) => res.json())
      .then(setSiteConfig)
      .catch(console.error);
  }, []);

  if (!data) return null;

  const discussionLinks = {
    start: "https://github.com/orgs/digitalgeosciences/discussions/new?category=new-proposals",
    browse: "https://github.com/orgs/digitalgeosciences/discussions",
  };
  const buttonsDisabled = false;
  const buttonDisabledClasses = "";
  const contactEmail = siteConfig?.site.contact;

  return (
    <section id="join" className="py-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
              <Link
                to="/projects-and-collaborators"
                className="group inline-flex items-center gap-2"
              >
                <span>{data.header.title}</span>
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-primary transition-colors duration-200 group-hover:text-primary/80">
                  VIEW ALL
                </span>
              </Link>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {data.header.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">
              {data.eligibility.title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {data.eligibility.description}
            </p>
            <ul className="space-y-3">
              {data.eligibility.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-education mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground leading-relaxed">
                    {requirement}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-card-border rounded-3xl p-8 shadow-card">
            <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">
              {data.cta.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.cta.description}
            </p>

            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {data.cta.whyTitle}
              </p>
              <ul className="mt-4 space-y-4 text-sm text-foreground">
                {data.cta.highlights.map((text, index) => {
                  const Icon = highlightIcons[index] ?? MessageCircle;
                  return (
                    <li key={text} className="flex items-start gap-3">
                      <div className="rounded-full bg-primary/15 p-2 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={discussionLinks.start}
                className={`inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:bg-primary/90 ${buttonDisabledClasses}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={buttonsDisabled}
                tabIndex={buttonsDisabled ? -1 : undefined}
              >
                {data.cta.buttons.startLabel}
              </a>
              <a
                href={discussionLinks.browse}
                className={`inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary ${buttonDisabledClasses}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={buttonsDisabled}
                tabIndex={buttonsDisabled ? -1 : undefined}
              >
                {data.cta.buttons.browseLabel}
              </a>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              {contactEmail ? (
                <>
                  Need help drafting your idea?{" "}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-primary hover:underline"
                  >
                    Email us
                  </a>{" "}
                  or open a draft discussion - a maintainer will jump in with
                  guidance.
                </>
              ) : (
                data.cta.note
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
