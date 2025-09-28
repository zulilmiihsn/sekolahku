require('dotenv').config();

console.log('🔍 Debugging environment variables...');
console.log('');

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

console.log('');
console.log('📋 Values (first 20 chars):');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...');
console.log('ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
console.log('SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...');
console.log('JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 20) + '...');

