/*
  # Initial Real Breda CF Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users id
      - `username` (text, unique) - Pro Clubs player name
      - `discord_id` (text, nullable) - Discord user ID for OAuth
      - `role` (enum) - admin, owner, or user
      - `owned_player_id` (uuid, nullable) - references players table
      - `created_at` (timestamp)

    - `players`
      - `id` (uuid, primary key)
      - `name` (text) - Player display name
      - `position` (enum) - GK, DEF, MID, FWD
      - `jersey_number` (integer, unique)
      - `profile_image` (text, nullable) - URL to profile image
      - `owner_id` (uuid, nullable) - references users table
      - `created_at` (timestamp)

    - `player_stats`
      - `id` (uuid, primary key)
      - `player_id` (uuid) - references players table
      - `league` (enum) - eafc or competitive
      - `appearances` (integer, default 0)
      - `goals` (integer, default 0)
      - `assists` (integer, default 0)
      - `clean_sheets` (integer, default 0)
      - `motm_awards` (integer, default 0)
      - `rating` (decimal, default 0.0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read data
    - Add policies for admins and owners to edit their data
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'user');
CREATE TYPE player_position AS ENUM ('GK', 'DEF', 'MID', 'FWD');
CREATE TYPE league_type AS ENUM ('eafc', 'competitive');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  discord_id text,
  role user_role DEFAULT 'user',
  owned_player_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position player_position NOT NULL,
  jersey_number integer UNIQUE NOT NULL,
  profile_image text,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  league league_type NOT NULL,
  appearances integer DEFAULT 0,
  goals integer DEFAULT 0,
  assists integer DEFAULT 0,
  clean_sheets integer DEFAULT 0,
  motm_awards integer DEFAULT 0,
  rating decimal(3,1) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(player_id, league)
);

-- Add foreign key constraint for owned_player_id
ALTER TABLE users ADD CONSTRAINT users_owned_player_id_fkey 
  FOREIGN KEY (owned_player_id) REFERENCES players(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read all user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any user"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for players table
CREATE POLICY "Anyone can read players"
  ON players
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all players"
  ON players
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Owners can update their own player"
  ON players
  FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for player_stats table
CREATE POLICY "Anyone can read player stats"
  ON player_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage all player stats"
  ON player_stats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Owners can update their player stats"
  ON player_stats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM players p
      JOIN users u ON u.owned_player_id = p.id
      WHERE p.id = player_stats.player_id 
      AND u.id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, username, discord_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'provider_id'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for player_stats updated_at
CREATE TRIGGER update_player_stats_updated_at
  BEFORE UPDATE ON player_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();