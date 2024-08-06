CREATE OR REPLACE FUNCTION select_game(p_id INT)
RETURNS TABLE(id INT, title TEXT, url TEXT, image TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT id, title, url, image
    FROM games
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;