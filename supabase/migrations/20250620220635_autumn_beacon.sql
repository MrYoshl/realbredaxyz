/*
  # Insert Sample Data for Real Breda CF

  1. Sample Players
    - Create players for each position with realistic stats
    - Include profile images from Pexels

  2. Sample Stats
    - Add EA FC and competitive league stats for each player
    - Realistic performance data
*/

-- Insert sample players
INSERT INTO players (id, name, position, jersey_number, profile_image) VALUES
  -- Goalkeepers
  ('550e8400-e29b-41d4-a716-446655440001', 'Marco van Dijk', 'GK', 1, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Tom Hendriks', 'GK', 12, 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  
  -- Defenders
  ('550e8400-e29b-41d4-a716-446655440003', 'Lars de Jong', 'DEF', 3, 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Kevin van Beek', 'DEF', 4, 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Rico Janssen', 'DEF', 5, 'https://images.pexels.com/photos/1484800/pexels-photo-1484800.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  
  -- Midfielders
  ('550e8400-e29b-41d4-a716-446655440006', 'Danny Vermeulen', 'MID', 6, 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Stefan Bakker', 'MID', 8, 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  
  -- Forwards
  ('550e8400-e29b-41d4-a716-446655440008', 'Mike van Rijn', 'FWD', 9, 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Jesse Koeman', 'FWD', 11, 'https://images.pexels.com/photos/1556667/pexels-photo-1556667.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop')
ON CONFLICT (jersey_number) DO NOTHING;

-- Insert EA FC League stats
INSERT INTO player_stats (player_id, league, appearances, goals, assists, clean_sheets, motm_awards, rating) VALUES
  -- Goalkeepers - EA FC
  ('550e8400-e29b-41d4-a716-446655440001', 'eafc', 28, 0, 2, 12, 5, 7.8),
  ('550e8400-e29b-41d4-a716-446655440002', 'eafc', 12, 0, 0, 6, 1, 7.2),
  
  -- Defenders - EA FC
  ('550e8400-e29b-41d4-a716-446655440003', 'eafc', 32, 3, 8, 15, 4, 8.1),
  ('550e8400-e29b-41d4-a716-446655440004', 'eafc', 29, 1, 4, 13, 2, 7.6),
  ('550e8400-e29b-41d4-a716-446655440005', 'eafc', 26, 2, 6, 11, 3, 7.9),
  
  -- Midfielders - EA FC
  ('550e8400-e29b-41d4-a716-446655440006', 'eafc', 34, 8, 15, 0, 7, 8.4),
  ('550e8400-e29b-41d4-a716-446655440007', 'eafc', 31, 6, 12, 0, 5, 8.0),
  
  -- Forwards - EA FC
  ('550e8400-e29b-41d4-a716-446655440008', 'eafc', 33, 24, 8, 0, 12, 8.7),
  ('550e8400-e29b-41d4-a716-446655440009', 'eafc', 28, 18, 11, 0, 8, 8.3)
ON CONFLICT (player_id, league) DO NOTHING;

-- Insert Competitive League stats
INSERT INTO player_stats (player_id, league, appearances, goals, assists, clean_sheets, motm_awards, rating) VALUES
  -- Goalkeepers - Competitive
  ('550e8400-e29b-41d4-a716-446655440001', 'competitive', 15, 0, 1, 8, 3, 8.2),
  ('550e8400-e29b-41d4-a716-446655440002', 'competitive', 8, 0, 0, 3, 1, 7.5),
  
  -- Defenders - Competitive
  ('550e8400-e29b-41d4-a716-446655440003', 'competitive', 18, 2, 5, 9, 2, 8.3),
  ('550e8400-e29b-41d4-a716-446655440004', 'competitive', 16, 1, 3, 8, 1, 7.8),
  ('550e8400-e29b-41d4-a716-446655440005', 'competitive', 14, 1, 4, 7, 2, 8.0),
  
  -- Midfielders - Competitive
  ('550e8400-e29b-41d4-a716-446655440006', 'competitive', 19, 5, 9, 0, 4, 8.6),
  ('550e8400-e29b-41d4-a716-446655440007', 'competitive', 17, 4, 7, 0, 3, 8.2),
  
  -- Forwards - Competitive
  ('550e8400-e29b-41d4-a716-446655440008', 'competitive', 18, 15, 5, 0, 8, 9.1),
  ('550e8400-e29b-41d4-a716-446655440009', 'competitive', 16, 11, 7, 0, 5, 8.5)
ON CONFLICT (player_id, league) DO NOTHING;