import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { templates } from "@/lib/templates";
import { animeAvatars } from "@/lib/avatars";
import { InvitationCard, type InvitationData } from "@/components/InvitationCard";
import { Upload, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/create")({
  validateSearch: z.object({ id: z.string().optional() }).parse,
  component: CreatePage,
});

const STICKERS = ["🎉","🎈","✨","🌸","💖","🥂","🌿","🎂","🎁","🌟","💐","🪩"];
const FONTS = [
  { id: "display", label: "Cormorant Serif" },
  { id: "sans", label: "Karla Sans" },
];
const COLORS = ["#f8e8ee","#e8c5d0","#c9a0dc","#fef0f5","#ffe4cc","#0f1b3d","#1a1033","#fbf3ee"];

function CreatePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { id } = useSearch({ from: "/create" });

  const [form, setForm] = useState<InvitationData>({
    template_id: "birthday",
    event_title: "",
    host_names: "",
    message: "",
    event_date: null,
    venue: "",
    background_color: "#f8e8ee",
    font_style: "display",
    stickers: [],
    image_url: null,
    avatar_preset: null,
  });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/auth" });
  }, [user, loading, router]);

  useEffect(() => {
    if (!id || !user) return;
    supabase.from("invitations").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) return;
      setForm({
        template_id: data.template_id,
        event_title: data.event_title,
        host_names: data.host_names,
        message: data.message,
        event_date: data.event_date,
        venue: data.venue,
        background_color: data.background_color,
        font_style: data.font_style,
        stickers: data.stickers,
        image_url: data.image_url,
        avatar_preset: data.avatar_preset,
      });
    });
  }, [id, user]);

  const set = <K extends keyof InvitationData>(k: K, v: InvitationData[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleUpload(file: File) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("invitation-images").upload(path, file, { contentType: file.type, upsert: false });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("invitation-images").getPublicUrl(path);
    set("image_url", data.publicUrl);
    set("avatar_preset", null);
    toast.success("Photo uploaded");
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleUpload(f);
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleUpload(f);
  }

  async function save() {
    if (!user) return;
    if (!form.event_title.trim()) return toast.error("Add an event title");
    setSaving(true);
    if (id) {
      const { error } = await supabase.from("invitations").update(form).eq("id", id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Saved");
      router.navigate({ to: "/preview/$id", params: { id } });
    } else {
      const { data, error } = await supabase.from("invitations").insert({ ...form, user_id: user.id }).select().single();
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Created");
      router.navigate({ to: "/preview/$id", params: { id: data.id } });
    }
  }

  const dateInput = useMemo(() => {
    if (!form.event_date) return "";
    const d = new Date(form.event_date);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, [form.event_date]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto grid gap-10 px-4 py-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Builder */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{id ? "Editing" : "Create"}</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">{id ? "Refine your invitation" : "Craft your invitation"}</h1>

          <Tabs defaultValue="basics" className="mt-8">
            <TabsList className="grid w-full grid-cols-4 rounded-full">
              <TabsTrigger value="basics" className="rounded-full">Basics</TabsTrigger>
              <TabsTrigger value="template" className="rounded-full">Template</TabsTrigger>
              <TabsTrigger value="style" className="rounded-full">Style</TabsTrigger>
              <TabsTrigger value="image" className="rounded-full">Photo</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="mt-6 space-y-4">
              <div className="space-y-1">
                <Label>Event title</Label>
                <Input value={form.event_title} onChange={(e) => set("event_title", e.target.value)} placeholder="Iris & Theo" />
              </div>
              <div className="space-y-1">
                <Label>Host names</Label>
                <Input value={form.host_names ?? ""} onChange={(e) => set("host_names", e.target.value)} placeholder="Together with their families" />
              </div>
              <div className="space-y-1">
                <Label>Custom message</Label>
                <Textarea rows={3} value={form.message ?? ""} onChange={(e) => set("message", e.target.value)} placeholder="Request the honor of your presence" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Date & time</Label>
                  <Input type="datetime-local" value={dateInput} onChange={(e) => set("event_date", e.target.value ? new Date(e.target.value).toISOString() : null)} />
                </div>
                <div className="space-y-1">
                  <Label>Venue</Label>
                  <Input value={form.venue ?? ""} onChange={(e) => set("venue", e.target.value)} placeholder="Villa Aurora · Tuscany" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stickers</Label>
                <div className="flex flex-wrap gap-2">
                  {STICKERS.map((s) => {
                    const active = form.stickers?.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("stickers", active ? form.stickers!.filter(x => x !== s) : [...(form.stickers ?? []), s])}
                        className={`grid h-10 w-10 place-items-center rounded-2xl text-lg transition ${active ? "bg-gradient-primary shadow-soft scale-110" : "bg-muted hover:bg-accent"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template" className="mt-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { set("template_id", t.id); set("background_color", t.bg); }}
                    className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition ${form.template_id === t.id ? "border-primary shadow-soft" : "border-transparent hover:border-border"}`}
                    style={{ background: t.bg }}
                  >
                    <div className="text-2xl">{t.emoji}</div>
                    <div className="mt-3 font-display text-base" style={{ color: t.accent }}>{t.name}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-60">{t.category}</div>
                    {form.template_id === t.id && (
                      <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></div>
                    )}
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Background color</Label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => set("background_color", c)}
                      className={`h-10 w-10 rounded-full border-2 transition ${form.background_color === c ? "border-primary scale-110 shadow-soft" : "border-border"}`}
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ))}
                  <label className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-2 border-dashed border-border text-xs">
                    <input type="color" value={form.background_color ?? "#ffffff"} onChange={(e) => set("background_color", e.target.value)} className="sr-only" />
                    +
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Typography</Label>
                <div className="flex gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => set("font_style", f.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${form.font_style === f.id ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-6 space-y-6">
              <div>
                <Label className="mb-2 block">Anime avatar</Label>
                <div className="grid grid-cols-4 gap-3">
                  {animeAvatars.map((a) => (
                    <motion.button
                      key={a.id}
                      type="button"
                      whileHover={{ y: -3 }}
                      onClick={() => { set("avatar_preset", a.id); set("image_url", null); }}
                      className={`relative overflow-hidden rounded-2xl border-2 transition ${form.avatar_preset === a.id ? "border-primary shadow-soft" : "border-border"}`}
                    >
                      <img src={a.url} alt={a.name} className="aspect-square w-full bg-blush object-cover" />
                      <span className="absolute bottom-1 left-1 right-1 rounded-full bg-card/80 px-2 py-0.5 text-center text-[10px]">{a.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Or upload your photo</Label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition ${dragOver ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 font-display text-lg">Drop a photo here</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  {form.image_url && (
                    <div className="mt-4 inline-flex items-center gap-2 text-xs text-primary">
                      <ImageIcon className="h-3 w-3" /> Uploaded
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex gap-3">
            <Button onClick={save} disabled={saving} size="lg" className="rounded-full bg-gradient-primary px-7 shadow-soft">
              <Sparkles className="mr-2 h-4 w-4" /> {id ? "Save changes" : "Create invitation"}
            </Button>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="rounded-3xl border-border/60 bg-gradient-blush p-6 shadow-card">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Live preview</p>
            <div className="mx-auto max-w-sm">
              <InvitationCard data={form} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
