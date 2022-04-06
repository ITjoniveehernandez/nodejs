const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
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
    const data = [
        { id: 1, name: 'Jon Ivee Hernandez' },
        { id: 2, name: 'Edwin Torres' },
        { id: 3, name: 'Gabriel Salangsang' },
        { id: 4, name: 'Jared Lucas' }
    ];
    
    res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    dbCreate('brands');
    console.log(`Server is listening to port ${PORT}`);
});