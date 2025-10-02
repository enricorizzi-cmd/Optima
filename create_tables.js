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
    
    // Split SQL into individual statements  
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec', { sql: statement + ';' });
        
        if (error) {
          console.warn(`Warning in statement ${i + 1}:`, error.message);
          // Continue to next statement
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.warn(`Warning in statement ${i + 1}:`, err.message);
        // Continue to next statement
      }
    }
    
    console.log('Table creation process completed!');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

createTables();



