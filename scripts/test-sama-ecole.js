const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppcznlegkdtvruypbqva.supabase.co';
const anonKey = 'sb_publishable_4xiuCy8XjQAE6ZyIbjS-bQ_9SwiDOhR';

const supabase = createClient(supabaseUrl, anonKey);

async function testConnection() {
  console.log('Testing connection to Sama Ecole Supabase project...');
  
  // 1. Auth check
  const { data: authData, error: authErr } = await supabase.auth.getSession();
  console.log('Auth check:', authErr ? `Auth error: ${authErr.message}` : 'Auth service connected!');

  // 2. Query schools table check
  const { data, error } = await supabase.from('schools').select('*').limit(5);
  console.log('Schools table query result:', data, error ? `Notice: ${error.message}` : 'Table accessed!');
}

testConnection().catch(console.error);
