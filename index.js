const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send('holi')
});

app.get('/api',validateToken, (req, res) => {//API ejemplo
    res.json({
        username: req.user,
        ejemplo: [
            {
                id: 0,
                Text: 'ejemplo 1',
                username: 'paco'

            },
            {
                id: 0,
                Text: 'ejemplo 2',
                username: 'patito feliz'

            },
        ]
    })
});

app.get('/login', (req, res) => {
    res.send(`<html>
    <head>
        <title>Login</title>
    </head>
    <body>
        <form method = "POST" action="/auth">
            Nombre usuario: <input type="text" name="text"><br/>
            Contraseña: <input type="password" nam="password"><br/>
            <input type="submit" value="Iniciar sesion" />
        </form>
    </body>
    </html>
    
    `);
});

app.post('/auth', (req, res) => {
    const {username, password} = req.body;

    //consultar base de datos para validar que existe usuario

    //simula la validacion con la base de datos
    const user= {username: username};//aqui va la información que lleva el token


    const accessToken = generateAccessToken(user); //entre parentesis lo que se va a encriptar

    res.header('authorization', accessToken).json({
        message: 'Usuario autentificado',
        token: accessToken
    });
});

function generateAccessToken(user) {
    //el primero parametro es lo que se va a encriptar
    //lo segundo es la key secreta que caduca en 5 min
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'});

}

function validateToken(req,res,next){
    const accessToken = req.headers['authorization'] || req.query.accessToken;
    if (!accessToken) res.send('Access denied');

    //el primer parametro es el token que hemos recuperado
    jwt.verify(accessToken, process.env.SECRET, (err,user)=>{
        if(err){// si hay un error es que el token es falso
            res.send('Access denied, token invalido o caducado')
        }else{
            req.user=user;//se guarda para mostrarse 
            next();
        }

    });
};




app.listen(3000, () => {
    console.log('servidor iniciado puerto 3000');
});