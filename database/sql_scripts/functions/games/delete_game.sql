CREATE OR REPLACE FUNCTION delete_game(p_id INT)
RETURNS VOID AS $$
BEGIN
    DELETE FROM games
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;