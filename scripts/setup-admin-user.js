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
  console.error('');
  console.error('Please create a .env file with these variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdminUser() {
  try {
    console.log('🚀 Setting up admin user...');
    
    // 1. Buat tabel User
    console.log('👤 Creating User table...');
    const { error: userTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "User" (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (userTableError) {
      console.error('❌ Error creating User table:', userTableError);
      return;
    } else {
      console.log('✅ User table created successfully');
    }
    
    // 2. Hash password untuk admin default
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);
    
    // 3. Insert admin user default
    console.log('🔐 Creating default admin user...');
    const { error: insertUserError } = await supabase
      .from('User')
      .upsert({ 
        username: 'admin', 
        password: hashedPassword,
        role: 'admin',
        is_active: true
      });
    
    if (insertUserError) {
      console.error('❌ Error inserting admin user:', insertUserError);
      return;
    } else {
      console.log('✅ Default admin user created successfully');
    }
    
    // 4. Test login
    console.log('🧪 Testing admin user...');
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
    
    console.log('🎉 Admin user setup completed successfully!');
    console.log('📋 Login credentials:');
    console.log('   - Username: admin');
    console.log('   - Password: admin123');
    console.log('   - Role: admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
  }
}

setupAdminUser();

