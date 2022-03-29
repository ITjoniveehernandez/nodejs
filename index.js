const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Node.js Project</h1>');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`);
});