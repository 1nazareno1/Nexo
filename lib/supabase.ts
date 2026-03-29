import { createClient} from '@supabase/supabase-js';

export const supabase = createClient(
  "https://imgrdflyathasvcdweqx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZ3JkZmx5YXRoYXN2Y2R3ZXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjkzOTUsImV4cCI6MjA5MDMwNTM5NX0.kTc1E7AK17MXQ6lSjFxIxAuCMuHtN_kLojKIskbC-14",
);