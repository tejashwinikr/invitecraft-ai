
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Invitations
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  template_id TEXT NOT NULL DEFAULT 'birthday',
  event_title TEXT NOT NULL,
  host_names TEXT,
  message TEXT,
  event_date TIMESTAMPTZ,
  venue TEXT,
  background_color TEXT DEFAULT '#f8e8ee',
  font_style TEXT DEFAULT 'serif',
  stickers TEXT[] DEFAULT '{}',
  image_url TEXT,
  avatar_preset TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public invitations are viewable" ON public.invitations FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own invitations" ON public.invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON public.invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invitations" ON public.invitations FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER invitations_updated_at BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX invitations_user_id_idx ON public.invitations(user_id);
CREATE INDEX invitations_slug_idx ON public.invitations(slug);

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('invitation-images', 'invitation-images', true);

CREATE POLICY "Anyone can view invitation images" ON storage.objects FOR SELECT USING (bucket_id = 'invitation-images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'invitation-images' AND auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'invitation-images' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'invitation-images' AND (storage.foldername(name))[1] = auth.uid()::text);
