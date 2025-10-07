-- Fix security definer functions to include fixed search_path
-- This prevents privilege escalation attacks

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate handle_new_user function with fixed search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email
  );
  
  -- Insert default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id);
  
  -- Insert default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id);
  
  -- Log the signup activity
  PERFORM public.log_activity(
    new.id,
    'user_signup',
    'User account created',
    'authentication',
    jsonb_build_object('email', new.email)
  );
  
  RETURN new;
END;
$$;

-- Recreate log_activity function with fixed search_path
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid,
  p_action text,
  p_description text,
  p_category text,
  p_metadata jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  activity_id UUID;
BEGIN
  INSERT INTO public.activity_history (user_id, action, description, category, metadata)
  VALUES (p_user_id, p_action, p_description, p_category, p_metadata)
  RETURNING id INTO activity_id;
  
  RETURN activity_id;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();