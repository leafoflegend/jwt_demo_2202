const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/jwt_demo_2202');

const startDB = async () => {
    try {
        await client.connect();
    } catch (e) {
        throw e;
    }
}

module.exports = {
    client,
    startDB,
};
