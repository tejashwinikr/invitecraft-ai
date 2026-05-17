// Anime-style avatars via DiceBear (free, no key) — Lorelei + Adventurer styles.
export type AnimeAvatar = { id: string; name: string; url: string };

const seeds = [
  "Sakura", "Hikari", "Yuki", "Akira",
  "Mira", "Rin", "Kai", "Nori",
];

export const animeAvatars: AnimeAvatar[] = seeds.map((seed, i) => ({
  id: `anime-${i + 1}`,
  name: seed,
  url: `https://api.dicebear.com/9.x/${i % 2 === 0 ? "lorelei" : "adventurer"}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f8e8ee,e8c5d0,c9a0dc,fef0f5,f8c8d8&radius=50`,
}));

export const getAvatarByPreset = (id?: string | null) =>
  animeAvatars.find((a) => a.id === id) ?? null;
