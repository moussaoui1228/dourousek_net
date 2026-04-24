import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dfumuonkcfjxpwpmynrr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdW11b25rY2ZqeHB3cG15bnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjY4OTYsImV4cCI6MjA5MjU0Mjg5Nn0.lOLjZFaZf8HDji0IsfXN5SmrpB7hniW3U-n8Sn1d6WA'
);

async function test() {
  console.log('Signing up a test student...');
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test_student_123@dourous.net',
    password: 'password123',
    options: { data: { role: 'student', full_name: 'Test Student' } }
  });

  if (authError && !authError.message.includes('already registered')) {
    console.error('Signup error:', authError.message);
    return;
  }
  
  if (authError && authError.message.includes('already registered')) {
    await supabase.auth.signInWithPassword({ email: 'test_student_123@dourous.net', password: 'password123' });
  }

  console.log('Logged in successfully!');
  
  console.log('Inserting into professors manually...');
  const { error: insertError } = await supabase.from('professors').insert({
    id: authData.user.id,
    full_name: 'Test Prof',
    email: 'ahmed@prof.dourous.net',
    subject: 'Test Subject'
  });
  if (insertError) {
    console.error('Manual insert error:', insertError.message);
  }

  console.log('Fetching professors...');
  const { data, error } = await supabase.from('professors').select('*');
  if (error) {
    console.error('Error fetching professors:', error);
  } else {
    console.log('Professors found:', data.length);
    console.log(data);
  }

  const { data: students, error: err2 } = await supabase.from('students').select('*');
  if (students) {
    console.log('Students found:', students.length);
    console.log(students);
  }
}

test();
