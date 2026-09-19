const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ppcznlegkdtvruypbqva.supabase.co';
const apiKey = 'sb_publishable_4xiuCy8XjQAE6ZyIbjS-bQ_9SwiDOhR';

const supabase = createClient(supabaseUrl, apiKey);

async function deploy() {
  console.log('Reading schema.sql...');
  const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
  
  console.log('Attempting execution via rpc or SQL endpoint...');

  // Test 1: rpc query
  const { data: rpcRes, error: rpcErr } = await supabase.rpc('exec_sql', { sql: schemaSql });
  console.log('RPC exec_sql result:', rpcRes, rpcErr ? rpcErr.message : 'OK');

  // Test 2: direct REST query
  const res = await fetch(`${supabaseUrl}/rest/v1/`, {
    headers: {
      'apikey': apiKey,
      'Authorization': `Bearer ${apiKey}`
    }
  });
  console.log('REST root status:', res.status);
}

deploy().catch(console.error);
