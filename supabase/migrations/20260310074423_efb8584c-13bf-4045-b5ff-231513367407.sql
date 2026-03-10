
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site content"
ON public.site_content FOR SELECT TO public
USING (true);

CREATE POLICY "Admins can manage site content"
ON public.site_content FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with default profile data
INSERT INTO public.site_content (key, value, label, category) VALUES
  ('profile_name', 'Jerin M R', 'Full Name', 'profile'),
  ('profile_role', 'Entry-Level IT Professional', 'Job Title', 'profile'),
  ('profile_focus', 'Networking & Server Administration', 'Focus Area', 'profile'),
  ('profile_location', 'Thrissur, Kerala', 'Location', 'profile'),
  ('profile_email', 'jerinmr@hotmail.com', 'Email', 'profile'),
  ('profile_phone', '8848158987', 'Phone', 'profile'),
  ('profile_linkedin', 'https://linkedin.com/in/jerinmr51', 'LinkedIn URL', 'profile'),
  ('profile_bio', 'I''m an entry-level IT professional with practical experience in Cisco networking, Linux/Windows servers, and AWS. I specialize in finding secure, efficient solutions across IT environments.', 'Bio', 'profile'),
  ('profile_philosophy', 'Technology is best when it brings people together and solves real-world problems. I believe in continuous learning, hands-on experience, and building reliable, secure systems that users can depend on.', 'Philosophy', 'about'),
  ('profile_hobbies', 'Reading books, Gaming, Learning about universe', 'Hobbies', 'about'),
  ('profile_interests', 'Network security and ethical hacking, Open-source technologies and Linux systems, Contributing to tech communities', 'Interests', 'about');
