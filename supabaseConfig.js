

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wltmscdtviebsvvjqdch.supabase.co';
const SUPABASE_ANON_KEY = 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsdG1zY2R0dmllYnN2dmpxZGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDc4OTksImV4cCI6MjA2Mjg4Mzg5OX0.uN2-01-48u9sMxasNcw7mKIaYriJ_tLzfCbzF-KIRrY";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        'Supabase URL ou chave não estão definidos. Verifique as variáveis de ambiente.'
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);