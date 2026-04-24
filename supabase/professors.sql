CREATE TABLE professors (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE professors ENABLE ROW LEVEL SECURITY;

-- A professor can view their own profile
CREATE POLICY "Professors can view own profile"
  ON professors FOR SELECT
  USING (auth.uid() = id);

-- A professor can update their own profile
CREATE POLICY "Professors can update own profile"
  ON professors FOR UPDATE
  USING (auth.uid() = id);

-- Students can also view professors (to browse them)
CREATE POLICY "Students can view all professors"
  ON professors FOR SELECT
  USING (auth.role() = 'authenticated');

//trigger
CREATE OR REPLACE FUNCTION public.handle_new_professor()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.professors (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;