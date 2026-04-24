import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dfumuonkcfjxpwpmynrr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdW11b25rY2ZqeHB3cG15bnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjY4OTYsImV4cCI6MjA5MjU0Mjg5Nn0.lOLjZFaZf8HDji0IsfXN5SmrpB7hniW3U-n8Sn1d6WA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
