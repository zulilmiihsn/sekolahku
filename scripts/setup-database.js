const { createClient } = require('@supabase/supabase-js');
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

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Buat tabel settings
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS settings (
          id SERIAL PRIMARY KEY,
          key VARCHAR(255) UNIQUE NOT NULL,
          value TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createError) {
      console.error('Error creating table:', createError);
      return;
    }
    
    console.log('Table settings created successfully');
    
    // Insert default site_name
    const { error: insertError } = await supabase
      .from('settings')
      .upsert({ 
        key: 'site_name', 
        value: 'Sekolah Modern' 
      });
    
    if (insertError) {
      console.error('Error inserting default value:', insertError);
      return;
    }
    
    console.log('Default site_name inserted successfully');
    
    // Test query
    const { data, error: selectError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'site_name');
    
    if (selectError) {
      console.error('Error testing query:', selectError);
      return;
    }
    
    console.log('Test query successful:', data);
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupDatabase(); 