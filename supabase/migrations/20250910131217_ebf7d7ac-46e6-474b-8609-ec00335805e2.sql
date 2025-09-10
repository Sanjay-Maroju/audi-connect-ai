-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'participant' CHECK (role IN ('admin', 'moderator', 'participant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'ended')),
  max_participants INTEGER DEFAULT 100,
  ai_voice_enabled BOOLEAN DEFAULT true,
  translation_enabled BOOLEAN DEFAULT true,
  question_clustering_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create event seats table for QR codes
CREATE TABLE public.event_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  seat_number TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  occupied_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, seat_number)
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'answered', 'rejected')),
  priority INTEGER DEFAULT 0,
  cluster_id UUID,
  ai_voice_used BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create participants table for event participation
CREATE TABLE public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  seat_id UUID REFERENCES public.event_seats(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'hand_raised', 'approved', 'speaking')),
  mic_active BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, participant_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Anyone can view active events" ON public.events FOR SELECT USING (status = 'active' OR moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Moderators can manage their events" ON public.events FOR ALL USING (moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Event seats policies
CREATE POLICY "Anyone can view seats for active events" ON public.event_seats FOR SELECT USING (
  event_id IN (SELECT id FROM public.events WHERE status = 'active')
);
CREATE POLICY "Moderators can manage seats" ON public.event_seats FOR ALL USING (
  event_id IN (SELECT id FROM public.events WHERE moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

-- Questions policies
CREATE POLICY "Participants can view questions for their events" ON public.questions FOR SELECT USING (
  event_id IN (SELECT event_id FROM public.event_participants WHERE participant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
  OR event_id IN (SELECT id FROM public.events WHERE moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Participants can create questions" ON public.questions FOR INSERT WITH CHECK (
  participant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Participants can update own questions" ON public.questions FOR UPDATE USING (
  participant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Moderators can manage questions" ON public.questions FOR ALL USING (
  event_id IN (SELECT id FROM public.events WHERE moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

-- Event participants policies
CREATE POLICY "Participants can view event participation" ON public.event_participants FOR SELECT USING (
  participant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR event_id IN (SELECT id FROM public.events WHERE moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Participants can join events" ON public.event_participants FOR INSERT WITH CHECK (
  participant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Participants can update own participation" ON public.event_participants FOR UPDATE USING (
  participant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Moderators can manage participants" ON public.event_participants FOR ALL USING (
  event_id IN (SELECT id FROM public.events WHERE moderator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for live updates
ALTER TABLE public.questions REPLICA IDENTITY FULL;
ALTER TABLE public.event_participants REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;