const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://skmljuuxwnikfthgjrkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMyNTU3OCwiZXhwIjoyMDc0OTAxNTc4fQ.XyjQkbLQ8cfB7emJ3Qbcpe7zgxgzt_GJvF2tX9DAkA8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Creating tables in Supabase...');
    
    // Create organizations table
    console.log('Creating organizations...');
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .limit(1);
    
    if (orgError && orgError.code === 'PGRST116') {
      console.log('Organizations table does not exist, creating sample data...');
      
      // Insert sample organization
      const { data: newOrg, error: newOrgError } = await supabase
        .from('organizations')
        .insert([
          {
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Default Organization',
            slug: 'default'
          }
        ])
        .select();
      
      if (newOrgError) {
        console.error('Error creating organization:', newOrgError);
      } else {
        console.log('Organization created:', newOrg);
      }
    } else if (orgData) {
      console.log('Organizations table exists, found:', orgData.length, 'records');
    }
    
    // Test other tables
    const tables = ['raw_materials', 'finished_products', 'warehouses', 'operators', 'inventory_items', 'clients', 'customer_orders'];
    
    for (const table of tables) {
      console.log(`Testing ${table} table...`);
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`${table} table error:`, error.code, error.message);
      } else {
        console.log(`${table} table exists, found:`, data.length, 'records');
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

createTables();
