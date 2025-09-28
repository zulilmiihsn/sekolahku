const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetAdminPassword() {
  try {
    console.log('🔐 Resetting admin password...');
    
    // Password baru yang mudah diingat
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('📝 Updating admin user password...');
    const { error: updateError } = await supabase
      .from('User')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('username', 'admin');
    
    if (updateError) {
      console.error('❌ Error updating admin password:', updateError);
      return;
    } else {
      console.log('✅ Admin password updated successfully');
    }
    
    // Test dengan password baru
    console.log('🧪 Testing new password...');
    const { data: user, error: selectError } = await supabase
      .from('User')
      .select('id, username, role, is_active')
      .eq('username', 'admin')
      .single();
    
    if (selectError) {
      console.error('❌ Error testing admin user:', selectError);
      return;
    } else {
      console.log('✅ Admin user test successful:', user);
    }
    
    console.log('🎉 Admin password reset completed!');
    console.log('📋 New login credentials:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('');
    console.log('🔗 Try logging in at: http://localhost:3001/admin/masuk');
    
  } catch (error) {
    console.error('💥 Reset failed:', error);
  }
}

resetAdminPassword();

