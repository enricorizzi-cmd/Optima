const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'https://skmljuuxwnikfthgjrkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMyNTU3OCwiZXhwIjoyMDc0OTAxNTc4fQ.XyjQkbLQ8cfB7emJ3Qbcpe7zgxgzt_GJvF2tX9DAkA8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Creating tables in Supabase...');
    
    // Read the SQL file
    const sql = fs.readFileSync('./create_tables.sql', 'utf8');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error creating tables:', error);
      return;
    }
    
    console.log('Tables created successfully!');
    console.log('Data:', data);
    
  } catch (err) {
    console.error('Error:', err);
  }
}

createTables();
