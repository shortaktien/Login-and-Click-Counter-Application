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
