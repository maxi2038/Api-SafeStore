const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proyecto'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.use(cors());

app.get('/movimiento/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM movimiento WHERE id_movimiento = ?`;
  connection.query(query, [id], (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
