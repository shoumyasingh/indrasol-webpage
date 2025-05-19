/// <reference types="vite/client" />
 
interface ImportMetaEnv {
    
    // IND-suffixed variables
    readonly VITE_SUPABASE_URL_IND: string;
    readonly VITE_SUPABASE_SERVICE_KEY_IND: string;
    readonly VITE_SUPABASE_API_KEY_IND: string;
    readonly VITE_SUPABASE_SECRET_KEY_IND: string;
    readonly VITE_DEV_API_URL: string;
    readonly VITE_PROD_API_URL: string;

    // readonly VITE_BASE_API_URL: string;
    // readonly VITE_DEV_BASE_API_URL: string;
   
    // add more environment variables here if needed
  }
   
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
