import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (!loading && user) router.navigate({ to: "/dashboard" });
  }, [user, loading, router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    router.navigate({ to: "/dashboard" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { display_name: displayName || email.split("@")[0] },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to confirm.");
  }

  async function google() {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) { setBusy(false); toast.error("Google sign-in failed"); return; }
    if (res.redirected) return;
    router.navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center justify-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl">InviteCraft</span>
          </Link>

          <Card className="rounded-3xl border-border/60 p-7 shadow-card">
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger value="signin" className="rounded-full">Sign in</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6 space-y-4">
                <h1 className="font-display text-3xl">Welcome back</h1>
                <form onSubmit={signIn} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="e1">Email</Label>
                    <Input id="e1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p1">Password</Label>
                    <Input id="p1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full rounded-full bg-gradient-primary">Sign in</Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6 space-y-4">
                <h1 className="font-display text-3xl">Create your account</h1>
                <form onSubmit={signUp} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="n2">Display name</Label>
                    <Input id="n2" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Iris" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="e2">Email</Label>
                    <Input id="e2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="p2">Password</Label>
                    <Input id="p2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
                  </div>
                  <Button type="submit" disabled={busy} className="w-full rounded-full bg-gradient-primary">Create account</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
              <div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" />
            </div>

            <Button type="button" variant="outline" onClick={google} disabled={busy} className="w-full rounded-full">
              <GoogleIcon className="mr-2 h-4 w-4" /> Continue with Google
            </Button>
          </Card>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing you agree to our terms & privacy policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}
