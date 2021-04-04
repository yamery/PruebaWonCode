const express = require('express');
const exhbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;
const pool = require('./db');



const { database } = require('./keys');

const app = express();


app.use(cookieParser('shhh secreto'));

app.use(session({
    secret: 'shhh secreto',
    resave: true,
    saveUninitialized: true
}));
// inicializamos y agrgamos session
app.use(passport.initialize());
app.use(passport.session());

//configuracion passport



// funcion utilizada para verificar el inicio de sesion, se toma el usuario y se busca en la base de datos
// de una vez, se almacena en el session para utilizar los datos de quien inicio sesion
passport.use(new PassportLocal({
    usernameField: "email"
}, async(email, password, done) => {
    const usuarios = await pool.query('SELECT * FROM usuarios ');


    var verifi = false;


    for (var i = 0; i < usuarios.length; i++) {

        if (email === usuarios[i].Correo && password === usuarios[i].password) {

            const id = usuarios[i].ID_usuario;
            const email = usuarios[i].Correo;
            const password = usuarios[i].password;
            const _user = {
                id,
                email,
                password,

            }
            verifi = false;
            return done(null, _user)
        } else {
            verifi = true;

        }
    }
    if (verifi == true) {
        return done(null, false)
    }


}))


// serializar un usuario, tomar un objeto tipo user y de esta sacar el id para solo guardar este dato y evitar exceso de almacenamiento
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserializacion
passport.deserializeUser(async(id, done) => {
    const usuarios = await pool.query('SELECT * FROM usuarios where ID_usuario=?', id);
    const ide = usuarios[0].ID_usuario;
    const nombre = usuarios[0].Nombre;
    const user = {
            ide,
            nombre
        }
        // const _user = user.id === id ? user : false;
    done(null, user);
    // done(null, { id: 1, name: "Uriel" }, {});
});

//settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partial'),
    extname: '.hbs',
    helpers: {
        CompareDuration: function(value) {
            if (value == 1) {
                return "mensual";
            } else {
                return "anual";
            }

        },
        classcomparation: function(value) {
            if (value == 1) {
                return "text-primary";
            } else {
                return "text-success";
            }
        },
        CompareBtn: function(value) {
            if (value == 1) {
                return "btn-primary";
            } else {
                return "btn-success";
            }
        },
        VerifEmpre: function(value) {
            if (value == true) {
                return false;
            } else {
                return true;
            }
        }
    }
}));

app.set('view engine', '.hbs');

//middlewars

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//routes
app.use('/crudnodejs', require('./route/crud.js'));

//publica
app.use(express.static(path.join(__dirname, 'public')));



// inicio del servidor
app.listen(app.get('port'), () => {
    console.log("server on port : ", app.get('port'));
})

// principal con verificaion del login
// app.get('/crudnodejs/add', (req, res, next) => {
//     if (req.isAuthenticated()) return next();

//     res.redirect("/");
// }, (req, res) => {
//     res.redirect('/crudnodejs/add');
// });

// validacion de el primer ingreso para que si no ha iniciado sesion lo mande al login y si no, lo mande al inicio
app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.render("partial/login");
}, (req, res) => {
    //mostrar formulario de login
    res.redirect("/crudnodejs/add");

});

//post que recibe los datos del login y utiliza la funcion de verificar usuario

app.post("/login", passport.authenticate('local', {
    successRedirect: "/crudnodejs/add",
    failureRedirect: "/"
}));

// funcion para cerrar sesion
app.get("/logout", function(req, res) {
    //req.logout() viene en passport
    req.logout();
    //después de hacer log out redirige a la portada
    res.redirect("/");
});