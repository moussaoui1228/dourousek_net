import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dfumuonkcfjxpwpmynrr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdW11b25rY2ZqeHB3cG15bnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjY4OTYsImV4cCI6MjA5MjU0Mjg5Nn0.lOLjZFaZf8HDji0IsfXN5SmrpB7hniW3U-n8Sn1d6WA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'teacher@exemple.com',
    password: 'password' // wild guess
  });
  
  if (authError) {
    console.error('Auth error:', authError);
    // If we can't log in, try to use service role key if it exists in .env.local
  } else {
    console.log('Logged in as:', authData.user.email);
    const { data: sessions, error: sessionsError } = await supabase.from('sessions').select('*');
    console.log('Sessions:', sessions, 'Error:', sessionsError);
  }
}

test();
