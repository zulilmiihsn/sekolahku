const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Use environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createNewAdmin() {
  try {
    console.log('👤 Creating new admin user...');
    
    // Password yang mudah diingat
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Hapus user admin lama jika ada
    console.log('🗑️  Removing old admin user...');
    await supabase
      .from('User')
      .delete()
      .eq('username', 'admin');
    
    // Buat user admin baru
    console.log('➕ Creating new admin user...');
    const { data, error } = await supabase
      .from('User')
      .insert({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        is_active: true
      })
      .select();
    
    if (error) {
      console.error('❌ Error creating admin user:', error);
      return;
    }
    
    console.log('✅ New admin user created successfully:', data);
    
    // Test password
    console.log('🧪 Testing password...');
    const testPassword = await bcrypt.compare(password, hashedPassword);
    console.log('Password test result:', testPassword ? '✅ Valid' : '❌ Invalid');
    
    console.log('🎉 Setup completed!');
    console.log('📋 Login credentials:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('   - URL: http://localhost:3001/admin/masuk');
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

createNewAdmin();

