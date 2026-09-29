import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { Link } from "react-router-dom";
import { Users, Clock, Github, Globe, Linkedin, Mail, User } from "lucide-react";

interface Collaborator {
  name: string;
  role: string;
  photo?: string;
  participation: {
    start: string;
    end: string;
    status: "active" | "completed";
  };
  links?: {
    github?: string;
    website?: string;
    linkedin?: string;
    email?: string;
  };
  projects?: {
    name: string;
    url?: string;
  }[];
}

interface CollaboratorsData {
  header: {
    title: string;
    subtitle: string;
    note: string;
  };
  collaborators: Collaborator[];
}

const formatDate = (dateStr: string) => {
  if (dateStr === "Present") return "Present";

  const [year, month] = dateStr.split("-");
  const parsedDate = new Date(Number(year), Number(month) - 1);
  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const CollaboratorsSection = () => {
  const [data, setData] = useState<CollaboratorsData | null>(null);

  useEffect(() => {
    fetch(asset("data/collaborators.json"))
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return null;

  return (
    <section id="collaborators" className="py-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
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
          {data.header.subtitle && (
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {data.header.subtitle}
            </p>
          )}
          {data.header.note && (
            <p className="mt-3 text-sm text-muted-foreground">
              {data.header.note}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {data.collaborators.map((collaborator, index) => {
              const projectCount = collaborator.projects?.length ?? 0;
              const displayedProjects = collaborator.projects?.slice(0, 4) ?? [];
              const hasExtraProjects = projectCount > 4;

              return (
                <article
                  key={index}
                  className="rounded-3xl border border-card-border bg-card/80 p-5 shadow-card flex flex-col h-full transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl space-y-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {collaborator.photo ? (
                        <img
                          src={asset(collaborator.photo)}
                          alt={`${collaborator.name} profile`}
                          className="h-16 w-16 rounded-full object-cover border border-card-border shadow-md"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                            fallback?.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      <div
                        className={`h-16 w-16 rounded-full bg-muted border border-card-border flex items-center justify-center shadow-inner ${
                          collaborator.photo ? "hidden" : ""
                        }`}
                      >
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-foreground">
                        {collaborator.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {collaborator.role}
                      </p>
                    </div>
                  </div>

                  {displayedProjects.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 text-[0.75rem] sm:text-xs text-primary leading-none">
                      {displayedProjects.map((project, projectIndex) => (
                        <span
                          key={`${project.name}-${projectIndex}`}
                          className="flex items-center gap-1 whitespace-nowrap"
                        >
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold hover:underline"
                            >
                              {project.name}
                            </a>
                          ) : (
                            <span className="font-semibold">{project.name}</span>
                          )}
                          {projectIndex < displayedProjects.length - 1 && (
                            <span className="text-muted-foreground">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatDate(collaborator.participation.start)}
                        {" - "}
                        {formatDate(collaborator.participation.end)}
                      </span>
                    </div>
                    {hasExtraProjects ? (
                      <Link
                        to="/projects-and-collaborators"
                        className="text-[0.75rem] font-semibold uppercase tracking-widest text-primary hover:text-primary/80"
                      >
                        More
                      </Link>
                    ) : null}
                  </div>

                  {collaborator.links && (
                    <div className="mt-6 flex w-full items-center justify-center gap-3 text-muted-foreground">
                      {collaborator.links.github && (
                        <a
                          href={collaborator.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                          title="GitHub Profile"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {collaborator.links.website && (
                        <a
                          href={collaborator.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                          title="Personal Website"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {collaborator.links.linkedin && (
                        <a
                          href={collaborator.links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {collaborator.links.email && (
                        <a
                          href={`mailto:${collaborator.links.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                          title="Send email"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollaboratorsSection;
