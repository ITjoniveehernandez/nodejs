const express = require('express');
const mysql = require('mysql2/promise');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function dbConnect() {
    return mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'appdb'
    });
}

async function getCustomers() {
    let connection, rows, fields;

    try {
        connection = await dbConnect();
        [rows, fields] = await connection.execute('SELECT * FROM customers');
    } finally {
        await connection.end(); // for further investigation
        return rows;
    }
}

async function getCustomer(id) {
    let connection, row, fields;

    try {
        connection = await dbConnect();
        [row, fields] = await connection.execute('SELECT * FROM customers WHERE id = ?', [id]);
    } finally {
        await connection.end(); // for further investigation
        return row;
    }
}

async function postCustomer(firstname, lastname) {
    let connection, result;

    try {
        connection = await dbConnect();
        result = await connection.execute('INSERT INTO customers (firstname, lastname) VALUES (?, ?)', [firstname, lastname]);
    } finally {
        await connection.end(); // for further investigation
        /*
        console.log(result);
        console.log(result.length);
        */
        return result[0].insertId || 'Unable to post the data.';
    }
}

async function deleteCustomer(id) {
    let connection, result;

    try {
        connection = await dbConnect();
        result = await connection.execute('DELETE FROM customers WHERE id = ?', [id]);
    } finally {
        await connection.end(); // for further investigation
        return result[0].affectedRows || 'Unable to delete the data with an id of ' + id;
    }
}

async function updateCustomer(id, firstname, lastname) {
    let connection, result;

    try {
        connection = await dbConnect();
        result = await connection.execute('UPDATE customers SET firstname = ?, lastname = ? WHERE id = ?', [firstname, lastname, id]);
    } finally {
        await connection.end(); // for further investigation
        return result[0].affectedRows || 'Unable to update the data with an id of ' + id;
    }
}

// Get All Customer
app.get('/customers', (req, res) => {
    // Query Parameters, Example: /customers?id=1
    /*
    console.log(req.query.id);
    */
    
    getCustomers()
    .then(result => res.json({ data: result }))
    .catch(err => res.json({ message: 'Server error, please try again later.' }));

    /*
    .catch(err => {
        console.log(err.sqlMessage);
        res.json({ message: 'Server error, please try again later.' });
    });
    */
});

// Get Single Customer
app.get('/customers/:id', (req, res) => {
    const id = req.params.id;

    getCustomer(id)
    .then(result => res.json({ data: result }))
    .catch(err => res.json({ message: 'Server error, please try again later.' }));
});

// Post Customer
app.post('/customers', (req, res) => {
    const { firstname, lastname } = req.body;
    
    postCustomer(firstname, lastname)
    .then(result => res.json({ data: result }))
    .catch(err => res.json({ message: 'Server error, please try again later.' }));
});

// Delete Customer
app.delete('/customers/:id', (req, res) => {
    const id = req.params.id;

    deleteCustomer(id)
    .then(result => res.json({ data: result }))
    .catch(err => res.json({ message: 'Server error, please try again later.' }));
});

// Update Customer
app.patch('/customers/:id', (req, res) => {
    const id = req.params.id;
    const { firstname, lastname } = req.body;

    updateCustomer(id, firstname, lastname)
    .then(result => res.json({ data: result }))
    .catch(err => res.json({ message: 'Server error, please try again later.' }));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server is listening on port ' + PORT));