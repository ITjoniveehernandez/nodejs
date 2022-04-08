const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

function dbConnect(dbName = null) {
    return mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password :  null,
        database :  dbName
    });
}

const dbCreate = async (dbName) => {
    let connection, result;
    try {
        connection = await dbConnect();
        result = await connection.execute(`CREATE DATABASE ${dbName}`);
    } finally {
        await connection.end();
        return result;
    }
}

app.get('/', (req, res) => {
    res.send('<h1>Node.js Project</h1>');
});

app.get('/api/teams', (req, res) => {
    /* Basic Auth Base64 */
    console.log(req.headers.authorization);
    const encoded = req.headers.authorization;
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    console.log(decoded);
    /* End */
    
    const data = [
        { id: 1, fullname: 'Jon Ivee Hernandez' },
        { id: 2, fullname: 'Edwin Torres' },
        { id: 3, fullname: 'Gabriel Salangsang' },
        { id: 4, fullname: 'Jared Lucas' }
    ];
    
    res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    dbCreate('brands');
    console.log(`Server is listening to port ${PORT}`);
});