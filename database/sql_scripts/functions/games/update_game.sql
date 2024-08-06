CREATE OR REPLACE FUNCTION update_game(p_id INT, p_title TEXT, p_url TEXT, p_image TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE games
    SET title = p_title, url = p_url, image = p_image
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;