import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvfkwjstmlzlynjzkzyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2Zmt3anN0bWx6bHluanprenl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1OTc2MjgsImV4cCI6MjA1OTE3MzYyOH0.pkdEKfqNDjyJW7XtWOz6cU0ohjYWCzodHE08SlCA-mc';

export const supabase = createClient(supabaseUrl, supabaseKey);
