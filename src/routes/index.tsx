import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { templates } from "@/lib/templates";
import { InvitationCard } from "@/components/InvitationCard";
import { ArrowRight, Sparkles, Palette, Wand2, Download, Share2, Heart, Check } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="container mx-auto grid gap-12 px-4 py-20 md:grid-cols-12 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-7"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">AI-powered invitation design</span>
            </div>
            <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
              Invitations that
              <br />
              <span className="text-gradient italic">feel like a moment.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Design exquisite digital invitations in minutes. Pick a template, drop in a photo or
              generate an anime avatar, and share a link guests will want to open.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-gradient-primary px-7 shadow-soft hover:opacity-95">
                <Link to="/auth">Start designing <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                <a href="#gallery">Browse templates</a>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <div><span className="font-display text-2xl text-foreground">8+</span> templates</div>
              <div><span className="font-display text-2xl text-foreground">100%</span> mobile-ready</div>
              <div><span className="font-display text-2xl text-foreground">PNG</span> export</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="md:col-span-5"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-primary opacity-30 blur-3xl" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <InvitationCard
                  data={{
                    template_id: "wedding",
                    event_title: "Iris & Theo",
                    host_names: "Together with their families",
                    message: "Request the honor of your presence",
                    event_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
                    venue: "Villa Aurora · Tuscany",
                    stickers: ["💍", "🌿"],
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery grid */}
      <section id="gallery" className="container mx-auto px-4 py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Templates</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Eight starting points. <span className="italic text-gradient">Infinite finishes.</span></h2>
          <p className="mt-3 text-muted-foreground">Every template is fully editable — type, color, photo, stickers, layout.</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group"
            >
              <InvitationCard
                size="sm"
                data={{
                  template_id: t.id,
                  event_title: t.name,
                  host_names: t.category,
                  message: t.description,
                  event_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * (10 + i)).toISOString(),
                  venue: "Save the date",
                  stickers: [t.emoji],
                }}
              />
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="font-display text-lg">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/40 py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Features</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Everything you need to <span className="italic text-gradient">impress</span>.</h2>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Card className="h-full rounded-3xl border-border/60 p-6 shadow-card transition-shadow hover:shadow-soft">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-blush">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-xl">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-24">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Loved by hosts</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">A celebration before <span className="italic text-gradient">the celebration</span>.</h2>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
              <Card className="h-full rounded-3xl border-border/60 p-6 shadow-card">
                <Heart className="h-5 w-5 text-primary" />
                <p className="mt-4 font-display text-xl leading-snug">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gradient-blush py-24">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Pricing</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Simple, <span className="italic text-gradient">honest</span> plans.</h2>
          </motion.div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className={`relative rounded-3xl p-7 shadow-card ${p.featured ? "border-primary bg-card shadow-soft md:scale-105" : "border-border/60 bg-card/80"}`}>
                {p.featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">Most popular</span>}
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.name}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-5xl">${p.price}</span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.tagline}</p>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {f}</li>
                  ))}
                </ul>
                <Button asChild className={`mt-7 w-full rounded-full ${p.featured ? "bg-gradient-primary text-primary-foreground" : ""}`} variant={p.featured ? "default" : "outline"}>
                  <Link to="/auth">Get started</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  { icon: Palette, title: "Eight crafted templates", body: "From weddings to party night — each template is a complete typographic system." },
  { icon: Wand2, title: "Anime avatar generator", body: "Skip the photo shoot. Pick from eight anime-style avatars or upload your own." },
  { icon: Sparkles, title: "Live preview", body: "Every change you make appears instantly. Mobile-optimized from the start." },
  { icon: Download, title: "PNG export", body: "Download high-resolution PNGs ready for print or messaging." },
  { icon: Share2, title: "Shareable link", body: "Send a beautiful public link to guests — no app, no signup required for them." },
  { icon: Heart, title: "Save the moment", body: "All invitations saved to your dashboard. Edit, duplicate, or delete anytime." },
];

const testimonials = [
  { name: "Amelia", role: "Bride · Tuscany", quote: "Our save-the-dates looked like they came from a stationery boutique." },
  { name: "Daniyal", role: "Birthday host", quote: "I built an invite in under three minutes. Everyone asked who designed it." },
  { name: "Sora", role: "Graduation party", quote: "The anime avatars were SUCH a vibe. My friends loved them." },
];

const plans = [
  { name: "Free", price: 0, tagline: "Forever free for personal use.", features: ["3 invitations/month", "All 8 templates", "PNG export", "Share link"] },
  { name: "Pro", price: 9, tagline: "For frequent hosts.", featured: true, features: ["Unlimited invitations", "Custom backgrounds", "Anime avatar studio", "Priority rendering"] },
  { name: "Studio", price: 29, tagline: "For event planners.", features: ["Everything in Pro", "Team workspace", "White-label exports", "Custom domains"] },
];
