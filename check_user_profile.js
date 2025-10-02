const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://skmljuuxwnikfthgjrkg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrbWxqdXV4d25pa2Z0aGdqcmtnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMyNTU3OCwiZXhwIjoyMDc0OTAxNTc4fQ.XyjQkbLQ8cfB7emJ3Qbcpe7zgxgzt_GJvF2tX9DAkA8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserProfile() {
  console.log('=== Starting user profile check ===');
  try {
    console.log('Checking user profile...');
    
    const userId = '8277c7fb-90a1-46e6-91a0-8c5b7b41e47b';
    console.log('User ID:', userId);
    
    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error checking profile:', profileError);
      return;
    }
    
    if (profile) {
      console.log('User profile found:', profile);
    } else {
      console.log('User profile NOT found - this is the problem!');
      
      // Check if user exists in auth.users
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError) {
        console.error('Error checking auth user:', authError);
        return;
      }
      
      if (authUser.user) {
        console.log('Auth user found:', {
          id: authUser.user.id,
          email: authUser.user.email,
          user_metadata: authUser.user.user_metadata
        });
        
        // Create profile for user
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: userId,
              org_id: '00000000-0000-0000-0000-000000000001', // Default organization
              role: authUser.user.user_metadata?.role || 'viewer',
              full_name: authUser.user.user_metadata?.full_name || 'User'
            }
          ])
          .select();
        
        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          console.log('Profile created successfully:', newProfile);
        }
      } else {
        console.log('Auth user not found');
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  }
}

checkUserProfile();
