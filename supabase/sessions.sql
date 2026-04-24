//creat the sessions table 
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


//anable the RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- A student can only see their own sessions
CREATE POLICY "Students can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = student_id);

-- A student can create a session
CREATE POLICY "Students can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- A professor can see sessions assigned to them
CREATE POLICY "Professors can view their sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = professor_id);

-- A professor can update status (confirm or cancel)
CREATE POLICY "Professors can update session status"
  ON sessions FOR UPDATE
  USING (auth.uid() = professor_id);