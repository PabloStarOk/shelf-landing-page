import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
);

export const dbInfo = {
    schema: import.meta.env.SUPABASE_SCHEMA,
    formsTable: import.meta.env.SUPABASE_FORMS_TABLE,
    analyticsTable: import.meta.env.SUPABASE_ANALYTICS_TABLE
}
