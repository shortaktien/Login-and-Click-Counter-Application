const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'test',  // Ersetze 'DEIN_NEUES_PASSWORT' mit dem neuen Passwort
    port: 5432,
});
client.connect();

app.post('/api/login', async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    try {
        const query = 'SELECT * FROM players WHERE address = $1';
        const result = await client.query(query, [address]);

        if (result.rows.length > 0) {
            res.json({ status: 'success', data: result.rows[0] });
        } else {
            const insertQuery = 'INSERT INTO players (address, game_data) VALUES ($1, $2) RETURNING *';
            const insertResult = await client.query(insertQuery, [address, { clicks: 0 }]);
            res.json({ status: 'new', data: insertResult.rows[0] });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/save-game', async (req, res) => {
    const { address, gameData } = req.body;

    if (!address || !gameData) {
        return res.status(400).send('Address and game data are required');
    }

    try {
        const query = 'UPDATE players SET game_data = $1 WHERE address = $2 RETURNING *';
        const result = await client.query(query, [gameData, address]);

        if (result.rows.length > 0) {
            res.json({ status: 'success', data: result.rows[0] });
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/load-game', async (req, res) => {
    const { address } = req.body;

    if (!address) {
        return res.status(400).send('Address is required');
    }

    try {
        const query = 'SELECT game_data FROM players WHERE address = $1';
        const result = await client.query(query, [address]);

        if (result.rows.length > 0) {
            res.json({ status: 'success', data: result.rows[0].game_data });
        } else {
            res.status(404).send('Player not found');
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
