const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'src/public/images' });
const pool = require('../db');
const passport = require('passport');






// ------------------------------ PAgina inicio segun si tiene o no membresias
router.get('/add', async(req, res, next) => {
    if (req.isAuthenticated()) {
        const id_user = req.user.ide;
        const membre = await pool.query('SELECT Membresias_ID_membresia FROM usuarios_has_membresias where Usuarios_ID_usuario =? ', [id_user]);
        const empresa = await pool.query('SELECT * from usuarios where ID_usuario =?', [id_user]);

        var confirm = false;


        if (empresa[0].Correo === "empresa@") {
            confirm = true;
            botons = false;
        }

        if (membre[0]) {

            const id = membre[0].Membresias_ID_membresia;
            const membresias = await pool.query('SELECT * FROM membresias where ID_membresia =? ', [id]);
            res.render('partial/index2', { membresias, confirm });

        } else {
            const membresias = await pool.query('SELECT * FROM membresias ');
            res.render('partial/index', { membresias, confirm });
        }

    } else {
        res.redirect("/");
    }


});

// ---------- info timmer index trae los datos para que funcione el timmer que muestra al usuario lo que falta para terminar su membresia

router.post('/idUser', async(req, res) => {
    const compras = await pool.query('SELECT usuarios.Cedula AS Cedula, usuarios.Nombre AS Nombre, usuarios.Telefono AS Telefono, membresias.Name_membresia as membresia,usuarios_has_membresias.Fecha_compra as fecha_compra, membresias.duracion as duracion FROM usuarios_has_membresias JOIN usuarios on usuarios_has_membresias.Usuarios_ID_usuario=usuarios.ID_usuario JOIN membresias ON usuarios_has_membresias.Membresias_ID_membresia=membresias.ID_membresia where usuarios_has_membresias.Usuarios_ID_usuario =?', [req.user.ide]);

    res.send(compras);


});
// ------------------------------ AÑADIR MEMBRESIAS
router.post('/adduser', upload.single('imagen'), async(req, res) => {

    try {
        const { Name_membresia, Desc_membresia, Tit_imagen, duracion, precio } = req.body;
        const newMem = {
            Name_membresia,
            Desc_membresia,
            Tit_imagen,
            duracion,
            precio
        };


        fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1]);
        newMem.Tit_imagen = req.file.filename + '.' + req.file.mimetype.split('/')[1];

        await pool.query('INSERT INTO membresias set ?', [newMem]);
        res.redirect('/crudnodejs/add');

    } catch (error) {
        console.log("+++++++++++ error en el registro de membresias ++++++++++++");
        res.redirect("/");
    }
});

// router.post('/upload', upload.single('imagen'), (req, res) => {

//     console.log(req.file);
//     fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1]);

// });

// ----------------------------- ELIMINAR MEMBRESIA
router.get('/delete/:id', async(req, res) => {

    const { id } = req.params;
    const imagen = await pool.query('SELECT Tit_imagen FROM membresias WHERE ID_membresia=?', [id]);
    const imagen_user = imagen[0].Tit_imagen;
    // const user = await pool.query('SELECT Usuarios_ID_usuario FROM usuarios_has_membresias WHERE Membresias_ID_membresia=?', [id]);
    // const id_user = user[0].Usuarios_ID_usuario;
    try {
        fs.unlinkSync('src/public/images/' + imagen_user);

        pool.query('DELETE FROM membresias WHERE ID_membresia=?', [id]);
        // pool.query('DELETE FROM usuarios WHERE ID_usuario=?', [id_user]);
        res.redirect('/crudnodejs/add');
    } catch (err) {
        console.error('Something wrong happened removing the file', err)
    }

});

// ----------------------------- ENVIAR ID MEMBRESIA AL CREADOR USUARIO

router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const membresias = await pool.query('SELECT * FROM membresias WHERE ID_membresia=?', [id]);
    res.render('partial/compras', { membresia: membresias[0] });

});

// ruta para confirmar compra, recibe el id de la membresia escogida y hace la relacion en la base de datos

router.get('/ConCompra/:id', async(req, res) => {
    const Membresias_ID_membresia = req.params.id;
    const Usuarios_ID_usuario = req.user.ide;

    const compra = {
        Membresias_ID_membresia,
        Usuarios_ID_usuario
    }
    pool.query('INSERT INTO usuarios_has_membresias set ?', [compra]);
    res.redirect("/");

});

// ---------------------------------------- AÑADIR UN USUARIO Y REALIZAR LA COMPRA DE UNA MEMBRESIA

router.post('/addcompra', async(req, res) => {

    const { Membresias_ID_membresia, Cedula, Nombre, Apellidos, Telefono, Correo } = req.body;
    const newUser = {
        Cedula,
        Nombre,
        Apellidos,
        Telefono,
        Correo
    };
    await pool.query('INSERT INTO usuarios set ?', [newUser]);
    const ID_usuario = await pool.query('SELECT ID_usuario FROM usuarios WHERE Cedula=?', [Cedula]);
    const Usuarios_ID_usuario = ID_usuario[0].ID_usuario;
    let now = new Date();
    const Fecha_compra = now;
    const compra = {
        Membresias_ID_membresia,
        Usuarios_ID_usuario,
        Fecha_compra
    };




    await pool.query('INSERT INTO usuarios_has_membresias set ?', [compra]);
    res.redirect('/crudnodejs/add');
});

// -------- Registrar usuario

router.post('/Regis', async(req, res) => {

    try {
        const { Cedula, Nombre, Apellidos, Telefono, email, password } = req.body;
        const Correo = email;
        const newUser = {
            Cedula,
            Nombre,
            Apellidos,
            Telefono,
            Correo,
            password
        };
        await pool.query('INSERT INTO usuarios set ?', [newUser]);
        res.redirect("/");
    } catch (err) {
        console.log("+++++++++++ hubo un error en el registro de un usuario +++++++++++");
        res.redirect("/");
    }


});

//------ mostrar lista compras
router.get('/lista_compras', async(req, res) => {

    const compras = await pool.query('SELECT usuarios.Cedula AS Cedula, usuarios.Nombre AS Nombre, usuarios.Telefono AS Telefono, membresias.Name_membresia as membresia, membresias.duracion as duracion FROM usuarios_has_membresias JOIN usuarios on usuarios_has_membresias.Usuarios_ID_usuario=usuarios.ID_usuario JOIN membresias ON usuarios_has_membresias.Membresias_ID_membresia=membresias.ID_membresia ');
    res.render('partial/lista_compras', { compras });
});
module.exports = router;

// ------ consulta fecha de todas las compras
router.post('/endpoint', async(req, res) => {
    const compras = await pool.query('SELECT usuarios.Cedula AS Cedula, usuarios.Nombre AS Nombre, usuarios.Telefono AS Telefono, membresias.Name_membresia as membresia,usuarios_has_membresias.Fecha_compra as fecha_compra, membresias.duracion as duracion FROM usuarios_has_membresias JOIN usuarios on usuarios_has_membresias.Usuarios_ID_usuario=usuarios.ID_usuario JOIN membresias ON usuarios_has_membresias.Membresias_ID_membresia=membresias.ID_membresia ');

    res.send(compras);
});

// eliminar una relacion membresia/usuario cuando el tiempo de su subscripcion se acabo

router.post('/deleteRelation', async(req, res) => {
    const comi = "hola";
    const saludo = req.body.saludo;

    res.send(comi);

    const cedula = req.body.saludo;
    const ident = await pool.query('SELECT ID_usuario FROM usuarios WHERE Cedula=?', [cedula]);
    const id = ident[0].ID_usuario;


    try {
        pool.query('DELETE FROM usuarios_has_membresias WHERE 	Usuarios_ID_usuario=?', [id]);
        // pool.query('DELETE FROM usuarios WHERE ID_usuario=?', [id_user]);

    } catch (err) {
        console.error('Something wrong happened removing the file', err)
    }
});