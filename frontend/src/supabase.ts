// src/supabase.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL_IND;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY_IND;

// Debug environment variables
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Key exists' : 'Key is missing');

export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);










// import { createClient } from '@supabase/supabase-js';

// // Get environment variables
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL_IND;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY_IND; 

// // Check for missing environment variables
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.warn(
//     'Missing Supabase environment variables. Make sure VITE_SUPABASE_URL_IND and VITE_SUPABASE_API_KEY_IND are defined in your .env file.'
//   );
// }
// console.log(supabaseUrl, supabaseAnonKey);

// // Create Supabase client with the anon key for client-side authentication
// const supabase = createClient(
//     supabaseUrl || '', 
//     supabaseAnonKey || ''
// );

// export default supabase;
