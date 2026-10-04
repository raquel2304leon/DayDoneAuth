const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.json());
const cors = require('cors');
app.use(cors());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

conexion.connect((error) => {
    if (error) {
        console.error('Error al conectar a MySQL:', error);
    } else {
        console.log('DayDoneAuth: conexion exitosa a MySQL (mydb)');
    }
});

app.post('/registro', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: 'Error: usuario y contrasena son requeridos'
        });
    }

    const correoGenerado = `${usuario.replace(/\s+/g, '.').toLowerCase()}@daydone.local`;

    const sqlVerificar = 'SELECT id_usuario FROM usuarios WHERE nombre = ?';
    conexion.query(sqlVerificar, [usuario], (error, resultados) => {
        if (error) {
            console.error('Error al verificar usuario:', error);
            return res.status(500).json({ mensaje: 'Error interno al verificar el usuario' });
        }
        if (resultados.length > 0) {
            return res.status(400).json({
                mensaje: 'Error: el usuario ya esta registrado'
            });
        }

        const sqlInsertar = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
        conexion.query(sqlInsertar, [usuario, correoGenerado, contrasena], (error, resultado) => {
            if (error) {
                console.error('Error al registrar usuario:', error);
                return res.status(500).json({ mensaje: 'Error al registrar el usuario' });
            }
            res.status(201).json({
                mensaje: 'Usuario registrado exitosamente'
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: 'Error: usuario y contrasena son requeridos'
        });
    }

    const sql = 'SELECT id_usuario, nombre FROM usuarios WHERE nombre = ? AND contraseña = ?';
    conexion.query(sql, [usuario, contrasena], (error, resultados) => {
        if (error) {
            console.error('Error al validar login:', error);
            return res.status(500).json({ mensaje: 'Error interno al validar el login' });
        }
        if (resultados.length > 0) {
            return res.status(200).json({
                mensaje: 'Autenticacion satisfactoria'
            });
        }
        return res.status(401).json({
            mensaje: 'Error en la autenticacion: usuario o contrasena incorrectos'
        });
    });
});

const PUERTO = 3002;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});
