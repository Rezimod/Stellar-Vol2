-- User profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions
CREATE TABLE public.missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ka TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ka TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL,
  target_object TEXT NOT NULL,
  target_type TEXT NOT NULL,
  points_reward INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL,
  reward_type TEXT,
  reward_description_en TEXT,
  reward_description_ka TEXT,
  required_conditions JSONB,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  season TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User mission progress
CREATE TABLE public.user_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('active', 'submitted', 'verified', 'rejected', 'expired')) DEFAULT 'active',
  photo_url TEXT,
  photo_metadata JSONB,
  ai_analysis JSONB,
  ai_score NUMERIC(3,2),
  weather_at_submission JSONB,
  sky_data_at_submission JSONB,
  rejection_reason TEXT,
  submitted_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Rewards
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mission_id UUID REFERENCES public.missions(id),
  reward_type TEXT NOT NULL,
  reward_code TEXT UNIQUE,
  description_en TEXT NOT NULL,
  description_ka TEXT NOT NULL,
  value_gel NUMERIC(10,2),
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed missions
INSERT INTO public.missions (title_en, title_ka, description_en, description_ka, difficulty, target_object, target_type, points_reward, xp_reward, reward_type, reward_description_en, reward_description_ka, required_conditions, season) VALUES

('Photograph the Moon', 'მთვარის ფოტოგრაფირება', 'Take a clear photo of the Moon showing visible craters or mare.', 'გადაიღე მთვარის ნათელი ფოტო, სადაც კრატერები ან ზღვები ჩანს.', 'easy', 'moon', 'moon', 50, 25, 'discount_10', '10% off any telescope', '10% ფასდაკლება ნებისმიერ ტელესკოპზე', '{"max_cloud_cover": 60}', '{all}'),

('Spot Jupiter', 'იუპიტერის დანახვა', 'Photograph Jupiter when it is visible in the night sky.', 'გადაიღე იუპიტერი, როცა ის ღამის ცაზე ჩანს.', 'easy', 'jupiter', 'planet', 40, 20, 'voucher_50', '50 GEL store voucher', '50 ლარიანი მაღაზიის ვაუჩერი', '{"min_altitude": 10, "visible": true, "max_cloud_cover": 50}', '{all}'),

('Capture Venus at Dusk', 'ვენერას გადაღება მწუხრისას', 'Photograph Venus near the horizon during evening twilight.', 'გადაიღე ვენერა ჰორიზონტთან საღამოს შუქ-ჩრდილში.', 'easy', 'venus', 'planet', 40, 20, 'discount_10', '10% off binoculars', '10% ფასდაკლება ბინოკლებზე', '{"visible": true, "max_cloud_cover": 50}', '{all}'),

('First Light — Any Celestial Object', 'პირველი შუქი — ნებისმიერი ციური ობიექტი', 'Take your first verified sky photo of any bright star or planet.', 'გადაიღე შენი პირველი ვერიფიცირებული ციური ფოტო ნებისმიერი კაშკაშა ვარსკვლავის ან პლანეტის.', 'easy', 'any_bright', 'planet', 30, 15, NULL, NULL, NULL, '{"max_cloud_cover": 70}', '{all}'),

('Saturn and Its Rings', 'სატურნი და მისი რგოლები', 'Capture Saturn showing hints of its ring system through a telescope.', 'გადაიღე სატურნი, სადაც ტელესკოპით რგოლის სისტემა მოჩანს.', 'medium', 'saturn', 'planet', 100, 50, 'discount_20', '20% off any telescope', '20% ფასდაკლება ნებისმიერ ტელესკოპზე', '{"min_altitude": 15, "visible": true, "max_cloud_cover": 30}', '{all}'),

('The Orion Nebula', 'ორიონის ნისლეული', 'Photograph the Orion Nebula (M42) — the great nebula in Orion constellation.', 'გადაიღე ორიონის ნისლეული (M42) — დიდი ნისლეული ორიონის თანავარსკვლავედში.', 'medium', 'orion_nebula', 'deep_sky', 120, 60, 'moon_lamp', 'Moon Lamp (table light)', 'მთვარის ლამპა (სამაგიდო)', '{"max_cloud_cover": 25}', '{winter,fall}'),

('The Pleiades Star Cluster', 'ფლეადების ვარსკვლავთგროვა', 'Capture the Pleiades (M45) — the Seven Sisters star cluster in Taurus.', 'გადაიღე ფლეადები (M45) — შვიდი და ვარსკვლავთგროვა კუროს თანავარსკვლავედში.', 'medium', 'pleiades', 'deep_sky', 100, 50, 'voucher_50', '50 GEL store voucher', '50 ლარიანი მაღაზიის ვაუჩერი', '{"max_cloud_cover": 30}', '{winter,fall}'),

('Mars — The Red Planet', 'მარსი — წითელი პლანეტა', 'Photograph Mars when it is visible, showing its distinct reddish color.', 'გადაიღე მარსი, როცა ის ხილულია, და აჩვენე მისი განსაკუთრებული მოწითალო ფერი.', 'medium', 'mars', 'planet', 80, 40, 'discount_20', '20% off any purchase', '20% ფასდაკლება ნებისმიერ შენაძენზე', '{"min_altitude": 15, "visible": true, "max_cloud_cover": 40}', '{all}'),

('Full Moon Portrait', 'სავსე მთვარის პორტრეტი', 'Take a detailed photo of a Full Moon showing surface features.', 'გადაიღე სავსე მთვარის დეტალური ფოტო, სადაც ზედაპირის დეტალები ჩანს.', 'medium', 'full_moon', 'moon', 90, 45, 'moon_lamp', 'Moon Lamp (table light)', 'მთვარის ლამპა (სამაგიდო)', '{"max_cloud_cover": 20, "moon_phase": "full"}', '{all}'),

('The Andromeda Galaxy', 'ანდრომედას გალაქტიკა', 'Photograph the Andromeda Galaxy (M31) — the farthest object visible to the naked eye.', 'გადაიღე ანდრომედას გალაქტიკა (M31) — ყველაზე შორეული ობიექტი, შეუიარაღებელი თვალით ხილული.', 'hard', 'andromeda', 'deep_sky', 200, 100, 'discount_30', '30% off premium telescopes', '30% ფასდაკლება პრემიუმ ტელესკოპებზე', '{"max_cloud_cover": 15}', '{fall,winter}'),

('Jupiter and Its Moons', 'იუპიტერი და მისი მთვარეები', 'Capture Jupiter showing at least 2 of its Galilean moons.', 'გადაიღე იუპიტერი, სადაც მინიმუმ 2 გალილეოს მთვარე ჩანს.', 'hard', 'jupiter_moons', 'planet', 200, 100, 'voucher_100', '100 GEL store voucher', '100 ლარიანი მაღაზიის ვაუჩერი', '{"min_altitude": 20, "visible": true, "max_cloud_cover": 20}', '{all}'),

('Crescent Moon with Earthshine', 'ნამგალი მთვარე დედამიწის შუქით', 'Photograph a thin crescent Moon showing Earthshine (the faint glow on the dark side).', 'გადაიღე თხელი ნამგალი მთვარე, სადაც დედამიწის შუქი (ბნელი მხარის სუსტი ბრწყინვალება) ჩანს.', 'hard', 'earthshine', 'moon', 180, 90, 'free_accessory', 'Free telescope accessory of choice', 'უფასო ტელესკოპის აქსესუარი არჩევანით', '{"max_cloud_cover": 20, "moon_illumination_max": 15}', '{all}'),

('Meteor Shower Capture', 'მეტეორული ნაკადის გადაღება', 'Photograph a meteor streak during an active meteor shower.', 'გადაიღე მეტეორის კვალი აქტიური მეტეორული ნაკადის დროს.', 'hard', 'meteor', 'event', 250, 125, 'voucher_100', '100 GEL store voucher + Moon Lamp', '100 ლარიანი ვაუჩერი + მთვარის ლამპა', '{"max_cloud_cover": 20}', '{all}');

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own missions" ON public.user_missions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own missions" ON public.user_missions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own missions" ON public.user_missions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rewards" ON public.rewards FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view missions" ON public.missions FOR SELECT USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Observer'), NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
