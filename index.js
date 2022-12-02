const express = require('express');
const cors = require('cors');
const path = require('path');
const { db_conecction } = require('./db/config');
require( 'dotenv' ).config();

// Crear el servidor / aplicacion de express
const app = express(); 

// Base de datos
db_conecction();

// Directorio publico
app.use(express.static('public'));

// Se visualizan las variables de entornos
//console.log(process.env);

// CORS
app.use(cors()); // se implementa middleware de cors

// Lectura y parseo de body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Definimos la ruta a resolver para la aplicacion angular en este caso
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,'public/index.html'));
});


app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo en puerto ${process.env.PORT}`);
});
