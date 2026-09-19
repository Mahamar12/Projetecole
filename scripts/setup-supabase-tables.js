const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://anlvzshxnokcnqikdhep.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubHZ6c2h4bm9rY25xaWtkaGVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjgyMzYxNSwiZXhwIjoyMTAyMzk5NjE1fQ.UUES9KRNR1fqs3Unjw-o5fx50sDRUbfuu9JozszO-aw';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

async function runSetup() {
  console.log('Checking Supabase tables for EduGestion Africa...');
  
  // Test query on schools table
  const { data: schools, error: schoolErr } = await supabase.from('schools').select('*').limit(1);
  console.log('Schools check:', schools, schoolErr ? `Error: ${schoolErr.message}` : 'Table exists!');

  if (schoolErr && schoolErr.code === 'PGRST301') {
    console.log('Table schools does not exist yet. Using seed insertion...');
  }

  // Let's attempt inserting a demo school
  const { data: insertedSchool, error: insErr } = await supabase.from('schools').upsert([
    {
      id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
      name: 'École Internationale du Sénégal',
      code: 'EIS-DAKAR',
      slug: 'eis-dakar',
      address: 'Avenue Cheikh Anta Diop, Fann-Mermoz',
      city: 'Dakar',
      country: 'Sénégal',
      phone: '+221 33 824 55 00',
      email: 'contact@eis-dakar.sn',
      currency: 'FCFA'
    }
  ]).select();

  console.log('Inserted/Upserted School Result:', insertedSchool, insErr ? `Error: ${insErr.message}` : 'SUCCESS!');
}

runSetup().catch(console.error);
