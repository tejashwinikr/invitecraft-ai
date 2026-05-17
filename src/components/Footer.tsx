import { Sparkles, Instagram, Twitter, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl">InviteCraft AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Design beautiful digital invitations in minutes. Powered by AI.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-display text-lg">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Templates</Link></li>
            <li><a href="/#features" className="hover:text-foreground">Features</a></li>
            <li><a href="/#pricing" className="hover:text-foreground">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-lg">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">About</a></li>
            <li><a href="#" className="hover:text-foreground">Contact</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-display text-lg">Follow</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-accent"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-accent"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Github" className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-accent"><Github className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} InviteCraft AI. Crafted with love.
      </div>
    </footer>
  );
}
