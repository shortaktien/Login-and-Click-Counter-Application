CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    game_data JSONB -- JSONB-Feld für die Spielstände
);
