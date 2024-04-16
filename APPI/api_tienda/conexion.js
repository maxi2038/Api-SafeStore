const express = require('express');
const cors = require('cors'); // Asegúrate de haber instalado el módulo 'cors' como se indicó anteriormente
const mysql = require('mysql');

const app = express();
const port = 8000;

// Configura el middleware CORS
app.use(cors());

// Configura el middleware para parsear JSON
app.use(express.json());

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "safestore"
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Define una ruta para buscar tiendas por nombre
app.get('/tiendas/:nombre', (req, res) => {
  const nombreTienda = req.params.nombre;
  const sql = 'SELECT * FROM tienda WHERE nombre_tienda = ?';

  // Realiza la consulta a la base de datos
  connection.query(sql, [nombreTienda], (err, results) => {
    if (err) {
      console.error('Error al buscar la tienda:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Tienda no encontrada' });
      return;
    }
    res.json(results[0]); // Envia los datos de la tienda encontrada como respuesta
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
