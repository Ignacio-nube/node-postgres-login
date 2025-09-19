require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');


const app = express();
// Vercel usa la variable de entorno PORT, si no existe, usamos el 3000
const port = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  // En producción (como en Vercel), puede que necesites SSL
  ssl: true,
});

// Middleware para servir archivos estáticos (nuestro index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear el cuerpo de las peticiones POST
app.use(express.urlencoded({ extended: true }));

// Ruta para manejar el login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // IMPORTANTE: Esto es inseguro para un entorno real.
    // Deberías hashear las contraseñas y no guardarlas en texto plano.
    // Esta consulta es solo para fines demostrativos.
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length > 0) {
      res.send('¡Login exitoso!');
    } else {
      res.status(401).send('Usuario o contraseña incorrectos.');
    }
  } catch (error) {
    console.error('Error al ejecutar la consulta', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
