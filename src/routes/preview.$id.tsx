import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { InvitationCard, type InvitationData } from "@/components/InvitationCard";
import { Download, Share2, Pencil, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/preview/$id")({ component: Preview });

function Preview() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<(InvitationData & { slug: string }) | null>(null);

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/auth" });
  }, [user, loading, router]);

  useEffect(() => {
    supabase.from("invitations").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error || !data) { toast.error("Not found"); return; }
      setData(data as InvitationData & { slug: string });
    });
  }, [id]);

  async function download() {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(data?.event_title || "invitation").replace(/\s+/g, "-")}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      toast.error("Couldn't generate PNG");
    }
  }

  async function share() {
    if (!data) return;
    const url = `${window.location.origin}/i/${data.slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 py-10">
        <Button variant="ghost" asChild className="mb-6"><Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Card className="rounded-3xl border-border/60 bg-gradient-blush p-6 shadow-card">
            {data ? (
              <div className="mx-auto max-w-sm">
                <InvitationCard ref={cardRef} data={data} />
              </div>
            ) : (
              <div className="aspect-[3/4] animate-pulse rounded-3xl bg-muted" />
            )}
          </Card>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Preview</p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">{data?.event_title ?? "Loading…"}</h1>
            <p className="mt-3 max-w-md text-muted-foreground">Download as PNG to print or send, or share a public link that anyone can open.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={download} size="lg" className="rounded-full bg-gradient-primary shadow-soft"><Download className="mr-2 h-4 w-4" /> Download PNG</Button>
              <Button onClick={share} size="lg" variant="outline" className="rounded-full"><Share2 className="mr-2 h-4 w-4" /> Copy share link</Button>
              <Button asChild size="lg" variant="ghost" className="rounded-full"><Link to="/create" search={{ id }}><Pencil className="mr-2 h-4 w-4" /> Edit</Link></Button>
            </div>

            {data && (
              <Card className="mt-8 rounded-3xl p-5 text-sm">
                <p className="font-display text-lg">Public link</p>
                <code className="mt-2 block break-all rounded-xl bg-muted p-3 text-xs">{`${typeof window !== "undefined" ? window.location.origin : ""}/i/${data.slug}`}</code>
              </Card>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
