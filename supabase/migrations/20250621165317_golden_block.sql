/*
  # Fix User Creation RLS Policies

  1. Security Updates
    - Add policy to allow user profile creation during signup
    - Update trigger function to use proper security context
    - Ensure RLS policies work correctly for new user registration

  2. Changes
    - Add INSERT policy for new user creation
    - Update handle_new_user function with proper permissions
    - Ensure users can create their own profile during signup
*/

-- Add policy to allow users to create their own profile during signup
CREATE POLICY "Users can create their own profile during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow service role to insert users (for the trigger)
CREATE POLICY "Service role can insert users"
  ON users
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Update the trigger function to use service role permissions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert user profile with service role permissions
  INSERT INTO public.users (id, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, ignore
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE LOG 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();