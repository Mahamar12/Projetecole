async function checkProject() {
  const url = 'https://ppcznlegkdtvruypbqva.supabase.co';
  
  console.log('Testing Supabase Auth Health for Sama Ecole...');
  try {
    const res = await fetch(`${url}/auth/v1/health`);
    console.log('Health status:', res.status);
    const data = await res.text();
    console.log('Health response:', data);
  } catch (err) {
    console.error('Error fetching health:', err);
  }

  console.log('Testing REST root...');
  try {
    const res = await fetch(`${url}/rest/v1/`);
    console.log('REST root status:', res.status);
    const data = await res.text();
    console.log('REST root response:', data);
  } catch (err) {
    console.error('Error fetching REST root:', err);
  }
}

checkProject();
