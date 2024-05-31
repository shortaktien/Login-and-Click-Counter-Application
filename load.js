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
