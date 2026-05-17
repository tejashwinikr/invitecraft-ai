import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { InvitationCard, type InvitationData } from "@/components/InvitationCard";
import { Plus, Pencil, Trash2, Copy, Share2, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type Row = InvitationData & { id: string; slug: string; created_at: string; user_id: string };

function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/auth" });
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("invitations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setRows((data ?? []) as Row[]);
      });
  }, [user]);

  async function remove(id: string) {
    const { error } = await supabase.from("invitations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r?.filter((x) => x.id !== id) ?? null);
    toast.success("Deleted");
  }

  async function duplicate(row: Row) {
    const { id: _id, slug: _slug, created_at: _ca, ...rest } = row;
    void _id; void _slug; void _ca;
    const { data, error } = await supabase.from("invitations").insert({ ...rest, event_title: row.event_title + " (copy)" }).select().single();
    if (error) return toast.error(error.message);
    setRows((r) => (r ? [data as Row, ...r] : [data as Row]));
    toast.success("Duplicated");
  }

  async function copyShare(slug: string) {
    const url = `${window.location.origin}/i/${slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied");
  }

  const filtered = rows?.filter((r) => r.event_title.toLowerCase().includes(q.toLowerCase())) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">Your invitations</h1>
          </div>
          <Button asChild className="rounded-full bg-gradient-primary shadow-soft">
            <Link to="/create"><Plus className="mr-2 h-4 w-4" /> New invitation</Link>
          </Button>
        </div>

        <div className="mt-6 flex max-w-md items-center gap-2 rounded-full border border-border bg-card px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invitations…" className="border-0 bg-transparent focus-visible:ring-0" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows === null && Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
          ))}
          {rows !== null && filtered!.length === 0 && (
            <Card className="col-span-full rounded-3xl border-dashed p-12 text-center">
              <h3 className="font-display text-2xl">No invitations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Start by creating your first one — it takes under three minutes.</p>
              <Button asChild className="mt-5 rounded-full bg-gradient-primary">
                <Link to="/create"><Plus className="mr-2 h-4 w-4" /> Create invitation</Link>
              </Button>
            </Card>
          )}
          {filtered?.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }}>
              <div className="group relative">
                <Link to="/preview/$id" params={{ id: r.id }}>
                  <div className="transition-transform group-hover:-translate-y-1">
                    <InvitationCard data={r} size="sm" />
                  </div>
                </Link>
                <div className="mt-3 flex items-center justify-between px-1">
                  <div className="truncate">
                    <p className="truncate font-display text-lg">{r.event_title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => copyShare(r.slug)} aria-label="Share"><Share2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => duplicate(r)} aria-label="Duplicate"><Copy className="h-4 w-4" /></Button>
                    <Button asChild size="icon" variant="ghost" aria-label="Edit"><Link to="/create" search={{ id: r.id }}><Pencil className="h-4 w-4" /></Link></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
