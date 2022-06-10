const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const { startDB, client } = require('./db/index');

const PORT = process.env.PORT || 3000;
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'super_secret_shhhhhhh';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
    const cookieFields = req.headers.cookie
        .split(';')
        .map((cookieSet) => cookieSet.trim().split('='))
        .reduce((acc, val) => {
            return {
                [val[0]]: val[1],
                ...acc,
            };
        }, {});

    console.log('Cookies', cookieFields);

    next();
});

app.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    console.log(username, password, req.body);

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

        res.cookie('SID', user.id);
        res.status(200);
        res.send({
            message: 'Login successful.',
            user,
            token,
        });
    } else {
        res.status(401).send({
            message: 'Wrong username or password.',
        });
    }
});

app.get('/clear', (req, res) => {
    res.clearCookie('SID');

    res.sendStatus(200);
})

const startApp = async () => {
    await startDB();

    app.listen(PORT, () => {
        console.log(`App is now listening on PORT: ${PORT}`);
    });
}

startApp();
