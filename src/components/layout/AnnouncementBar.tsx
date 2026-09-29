import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";
import { ArrowRight } from "lucide-react";

interface Announcement {
  enabled: boolean;
  message: string;
  linkText?: string;
  linkUrl?: string;
}

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetch(asset("data/announcement.json"))
      .then(res => res.json())
      .then(setAnnouncement)
      .catch(console.error);
  }, []);

  if (!announcement?.enabled) return null;

  return (
    <div className="w-full bg-primary text-primary-foreground text-sm">
      <div className="container mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <span>{announcement.message}</span>
        {announcement.linkUrl && (
          <a
            href={announcement.linkUrl}
            className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            {announcement.linkText || "Learn more"}
            <ArrowRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBar;
