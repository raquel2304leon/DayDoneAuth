// Importar Express para crear el servidor
const express = require('express');
const app = express();

// Permitir que el servidor reciba datos en formato JSON
app.use(express.json());

// Base de datos simulada de usuarios registrados
let usuarios = [];

// ── REGISTRO ─────────────────────────────────────────────
// Endpoint para registrar un nuevo usuario
// Metodo: POST
// URL: http://localhost:3000/registro
app.post('/registro', (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validar que se enviaron usuario y contrasena
    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: 'Error: usuario y contrasena son requeridos'
        });
    }

    // Verificar si el usuario ya existe
    const existe = usuarios.find(u => u.usuario === usuario);
    if (existe) {
        return res.status(400).json({
            mensaje: 'Error: el usuario ya esta registrado'
        });
    }

    // Guardar el nuevo usuario
    usuarios.push({ usuario, contrasena });
    res.status(201).json({
        mensaje: 'Usuario registrado exitosamente'
    });
});

// ── LOGIN ─────────────────────────────────────────────────
// Endpoint para iniciar sesion
// Metodo: POST
// URL: http://localhost:3000/login
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validar que se enviaron usuario y contrasena
    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: 'Error: usuario y contrasena son requeridos'
        });
    }

    // Buscar el usuario en la base de datos
    const usuarioEncontrado = usuarios.find(
        u => u.usuario === usuario && u.contrasena === contrasena
    );

    // Si existe el usuario y la contrasena es correcta
    if (usuarioEncontrado) {
        return res.status(200).json({
            mensaje: 'Autenticacion satisfactoria'
        });
    }

    // Si no existe o la contrasena es incorrecta
    return res.status(401).json({
        mensaje: 'Error en la autenticacion: usuario o contrasena incorrectos'
    });
});

// Iniciar el servidor en el puerto 3000
const PUERTO = 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});