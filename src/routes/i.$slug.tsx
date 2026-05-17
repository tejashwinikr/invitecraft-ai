import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { InvitationCard, type InvitationData } from "@/components/InvitationCard";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/i/$slug")({ component: SharePage });

function SharePage() {
  const { slug } = Route.useParams();
  const [data, setData] = useState<InvitationData | null | "missing">(null);

  useEffect(() => {
    supabase.from("invitations").select("*").eq("slug", slug).eq("is_public", true).maybeSingle().then(({ data }) => {
      setData(data ? (data as InvitationData) : "missing");
    });
  }, [slug]);

  return (
    <div className="min-h-screen bg-hero">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></div>
          <span className="font-display text-xl">InviteCraft</span>
        </Link>
        <Button asChild variant="outline" size="sm" className="rounded-full"><Link to="/">Create your own</Link></Button>
      </header>

      <main className="container mx-auto flex flex-col items-center justify-center px-4 py-10">
        {data === null && <div className="aspect-[3/4] w-full max-w-sm animate-pulse rounded-3xl bg-muted" />}
        {data === "missing" && (
          <div className="rounded-3xl bg-card p-10 text-center shadow-card">
            <h1 className="font-display text-3xl">Invitation not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">This link may have expired or been removed.</p>
            <Button asChild className="mt-5 rounded-full bg-gradient-primary"><Link to="/">Go home</Link></Button>
          </div>
        )}
        {data && data !== "missing" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
            <InvitationCard data={data} />
            <p className="mt-6 text-center text-xs text-muted-foreground">Made with <span className="text-primary">♥</span> on InviteCraft AI</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
