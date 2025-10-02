const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://skmljuuxwnikfthgjrkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMyNTU3OCwiZXhwIjoyMDc0OTAxNTc4fQ.XyjQkbLQ8cfB7emJ3Qbcpe7zgxgzt_GJvF2tX9DAkA8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSuppliers() {
  try {
    console.log('Testing suppliers table access...');
    
    // Try to list suppliers
    const { data, error } = await supabase
      .from('suppliers')
      .select('*');
    
    if (error) {
      console.error('Error accessing suppliers:', error);
      
      if (error.code === 'PGRST205') {
        console.log('Suppliers table does not exist. Need to create it.');
      }
    } else {
      console.log('Suppliers table exists!');
      console.log('Current suppliers:', data);
    }
    
    // Try to list deliveries
    const { data: deliveryData, error: deliveryError } = await supabase
      .from('deliveries')
      .select('*');
    
    if (deliveryError) {
      console.error('Error accessing deliveries:', deliveryError);
      
      if (deliveryError.code === 'PGRST205') {
        console.log('Deliveries table does not exist. Need to create it.');
      }
    } else {
      console.log('Deliveries table exists!');
      console.log('Current deliveries:', deliveryData);
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

testSuppliers();




