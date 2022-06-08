const { client, startDB } = require('./index');

const seed = async () => {
    console.log('Beginning seed.');

    await startDB();
    console.log('Connection established!');

    await client.query(`
        DROP TABLE IF EXISTS users;
    `);

    await client.query(`
        CREATE TABLE users
        (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
    `);

    console.log('User table created.');

    await client.query(`
        INSERT INTO users (username, password)
        VALUES ('eliot@szwajkowski.com', 'password123!');
    `);

    console.log('User created!');

    const { rows: users } = await client.query(`
        SELECT username FROM users;
    `);

    console.log('Users: ', users);

    client.end();
};

seed();
