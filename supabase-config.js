const SUPABASE_URL = "https://nlwrrrwkjpktrifxeymw.supabase.co";
const SUPABASE_KEY = "sb_publishable_0ymP9thOFXkuNYzvwa0gwQ_1mbxyFE6";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log(
    "SUPABASE CONNECTED:",
    !!window.supabaseClient
);
