import { useEffect, useMemo, useState } from "react";
import { asset } from "@/lib/asset";
import { Globe, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface Collaborator {
  name: string;
  projects?: {
    name: string;
  }[];
  links?: {
    github?: string;
    website?: string;
    linkedin?: string;
    email?: string;
  };
}

const contactDefinitions = [
  { type: "github", Icon: Github, label: "GitHub" },
  { type: "website", Icon: Globe, label: "Website" },
  { type: "linkedin", Icon: Linkedin, label: "LinkedIn" },
  { type: "email", Icon: Mail, label: "Email" },
] as const;

const getContributorIcons = (contributor: Collaborator, projectId: string) =>
  contactDefinitions
    .map(({ type, Icon, label }) => {
      const url =
        type === "email"
          ? contributor.links?.email
            ? `mailto:${contributor.links.email}`
            : undefined
          : contributor.links?.[type];
      if (!url) return null;
      return (
        <a
          key={`${projectId}-${contributor.name}-${type}-${url}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          <Icon className="h-4 w-4" />
        </a>
      );
    })
    .filter((icon): icon is JSX.Element => icon !== null);

const ProjectsAndCollaborators = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    fetch(asset("data/projects.json"))
      .then((res) => res.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(asset("data/collaborators.json"))
      .then((res) => res.json())
      .then((data) => setCollaborators(data.collaborators ?? []))
      .catch(console.error);
  }, []);

  const contributorMap = useMemo(() => {
    const map: Record<string, { name: string; links?: Collaborator["links"] }[]> = {};
    collaborators.forEach((collaborator) => {
      collaborator.projects?.forEach((project) => {
        const key = project.name.toLowerCase();
        if (!map[key]) {
          map[key] = [];
        }
        if (!map[key].some((entry) => entry.name === collaborator.name)) {
          map[key].push({
            name: collaborator.name,
            links: collaborator.links,
          });
        }
      });
    });
    return map;
  }, [collaborators]);

  const rows = useMemo(
    () =>
      projects.map((project) => ({
        project,
        contributors: contributorMap[project.title.toLowerCase()] || [],
      })),
    [projects, contributorMap]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Projects & Collaborators
            </p>
            <h1 className="text-3xl font-bold text-foreground">
              Builders supporting Digital Geosciences projects.
            </h1>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-6">
                <span>
                  {projects.length} project{projects.length === 1 ? "" : "s"}
                </span>
                <span>
                  {collaborators.length} collaborator
                  {collaborators.length === 1 ? "" : "s"}
                </span>
              </div>
              <Link
                to="/"
                className="text-sm font-semibold uppercase tracking-[0.4em] text-primary hover:text-primary/80 transition-colors"
              >
                Back home
              </Link>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto rounded-3xl border border-card-border bg-card/80 mt-4">
            <table className="table-compact w-full text-left text-sm">
              <thead>
                <tr className="text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">
                  <th className="px-2 py-2 text-left whitespace-nowrap w-auto">Project</th>
                  <th className="px-2 py-2 text-left w-[45%]">Description</th>
                  <th className="px-2 py-2 text-left w-[25%]">Contributors</th>
                  <th className="px-2 py-2 text-left w-[10%]">Contacts</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ project, contributors }) => (
                  <tr
                    key={project.id}
                    className="border-t border-card-border last:border-b bg-background/30"
                  >
                    <td className="px-2 py-2 font-semibold text-foreground w-auto">
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary hover:underline"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </td>
                    <td
                      className="px-2 py-2 text-muted-foreground w-[45%] whitespace-normal leading-tight break-words"
                      title={project.description}
                    >
                      {project.description}
                    </td>
                    <td className="px-2 py-2 text-foreground w-[25%] align-top">
                      {contributors.length ? (
                        <div className="space-y-1 text-[0.85rem] whitespace-normal break-words">
                          {contributors.map((contributor) => (
                            <div
                              key={`${project.id}-${contributor.name}`}
                              className="text-foreground"
                            >
                              {contributor.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not listed</span>
                      )}
                    </td>
                    <td className="px-2 py-2 align-top w-[10%]">
                      {contributors.length ? (
                        <div className="space-y-2">
                          {contributors.map((contributor) => {
                            const linkIcons = getContributorIcons(
                              contributor,
                              project.id
                            );
                            return (
                              <div
                                key={`contact-${project.id}-${contributor.name}`}
                                className="flex flex-wrap gap-2"
                              >
                                {linkIcons.length ? (
                                  linkIcons
                                ) : (
                                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                    n/a
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs uppercase tracking-[0.3em]">
                          n/a
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4 mt-4">
            {rows.map(({ project, contributors }) => (
              <article
                key={`mobile-${project.id}`}
                className="rounded-3xl border border-card-border bg-card/90 px-4 py-5 shadow-card space-y-4"
              >
                <div className="space-y-1">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-foreground hover:text-primary hover:underline"
                    >
                      {project.title}
                    </a>
                  ) : (
                    <p className="text-lg font-semibold text-foreground">
                      {project.title}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
                <div className="space-y-1 text-[0.85rem]">
                  <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
                    Contributors
                  </p>
                  {contributors.length ? (
                    <div className="space-y-[2px] text-[0.85rem] whitespace-normal break-words leading-tight">
                      {contributors.map((contributor) => {
                        const linkIcons = getContributorIcons(
                          contributor,
                          project.id
                        );

                        return (
                          <div
                            key={`mobile-${project.id}-${contributor.name}`}
                            className="space-y-2"
                          >
                            <p className="text-foreground">{contributor.name}</p>
                            {linkIcons.length ? (
                              <div className="flex flex-wrap gap-2">{linkIcons}</div>
                            ) : (
                              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                No contacts
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Not listed</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsAndCollaborators;
