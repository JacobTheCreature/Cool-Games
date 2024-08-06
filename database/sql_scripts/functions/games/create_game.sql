CREATE OR REPLACE FUNCTION create_game(p_title TEXT, p_url TEXT, p_image TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO games (title, url, image)
    VALUES (p_title, p_url, p_image);
END;
$$ LANGUAGE plpgsql;