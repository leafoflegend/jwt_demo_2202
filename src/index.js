const express = require('express');
const jwt = require('jsonwebtoken');
const { startDB, client } = require('./db/index');

const PORT = process.env.PORT || 3000;
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'super_secret_shhhhhhh';

const app = express();

app.use(express.json());

app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const { rows: [user] } = await client.query(`
        SELECT id, username FROM users WHERE username=$1 AND password=$2 LIMIT 1;
    `, [username, password]);

    if (user) {
        const token = jwt.sign(
            {
                user,
            },
            PRIVATE_KEY,
        );

        res.status(200).send({
            message: 'Login successful.',
            token,
        });
    } else {
        res.status(401).send({
            message: 'Wrong username or password.',
        });
    }
});

const startApp = async () => {
    await startDB();

    app.listen(PORT, () => {
        console.log(`App is now listening on PORT: ${PORT}`);
    });
}

startApp();
