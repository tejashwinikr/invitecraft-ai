import { forwardRef } from "react";
import { getTemplate, fontStyleMap, type Template } from "@/lib/templates";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";

export type InvitationData = {
  template_id: string;
  event_title: string;
  host_names?: string | null;
  message?: string | null;
  event_date?: string | null;
  venue?: string | null;
  background_color?: string | null;
  font_style?: string | null;
  stickers?: string[] | null;
  image_url?: string | null;
  avatar_preset?: string | null;
};

import { getAvatarByPreset } from "@/lib/avatars";

export const InvitationCard = forwardRef<HTMLDivElement, { data: InvitationData; size?: "sm" | "lg" }>(
  function InvitationCard({ data, size = "lg" }, ref) {
    const t: Template = getTemplate(data.template_id);
    const bg = data.background_color || t.bg;
    const font = fontStyleMap[data.font_style || t.fontFamily];
    const accent = t.accent;
    const isDarkBg = isDark(bg);
    const fg = isDarkBg ? "#fff" : "#1a1033";
    const muted = isDarkBg ? "rgba(255,255,255,0.75)" : "rgba(26,16,51,0.65)";

    const avatar = getAvatarByPreset(data.avatar_preset);
    const photo = data.image_url || avatar?.url || null;

    const aspectClass = size === "lg" ? "aspect-[3/4]" : "aspect-[3/4]";
    const dateText = data.event_date ? format(new Date(data.event_date), "EEEE, MMMM d, yyyy · h:mm a") : null;

    return (
      <div
        ref={ref}
        className={`relative w-full ${aspectClass} overflow-hidden rounded-3xl shadow-card`}
        style={{ background: bg, color: fg, fontFamily: font }}
      >
        {/* Decorative gradient orbs */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: accent }}
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: accent }}
        />

        {/* Frame */}
        <div className="absolute inset-3 rounded-2xl border" style={{ borderColor: `${accent}55` }} />

        <div className="relative flex h-full flex-col items-center justify-between p-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">{t.emoji}</span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: accent, fontFamily: "'Karla', sans-serif" }}
            >
              {t.category}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
            {photo && (
              <img
                src={photo}
                alt=""
                crossOrigin="anonymous"
                className="h-24 w-24 rounded-full object-cover shadow-soft"
                style={{ border: `3px solid ${accent}` }}
              />
            )}
            {data.host_names && (
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{ color: muted, fontFamily: "'Karla', sans-serif" }}
              >
                {data.host_names}
              </p>
            )}
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl" style={{ fontFamily: font }}>
              {data.event_title || "Your Event Title"}
            </h2>
            {data.message && (
              <p className="max-w-[80%] text-sm leading-relaxed" style={{ color: muted }}>
                {data.message}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col items-center gap-2 text-xs" style={{ fontFamily: "'Karla', sans-serif", color: muted }}>
            {dateText && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" style={{ color: accent }} />
                <span>{dateText}</span>
              </div>
            )}
            {data.venue && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" style={{ color: accent }} />
                <span>{data.venue}</span>
              </div>
            )}
            {data.stickers && data.stickers.length > 0 && (
              <div className="mt-1 text-base">{data.stickers.join(" ")}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

function isDark(hex: string) {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
}
