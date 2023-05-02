const inicio_Debug = require('debug')('app:inicio'); // Importar el paquete debug
                                    // El parametro indica el archivo y el entorno
                                    // de depuracion
const dbDebug = require('debug')('app:db');
const express = require('express'); // Importa el paquete express
const config = require('config'); // Importa el paquete config
const logger = require('./logger');
const morgan = require('morgan');
const Joi = require('joi'); // Importa el paquete joi
const app = express(); // Crea una instancia de express

// Caules son los metodos a implementar
// con su ruta
// app.get(); // Consulta
// app.post(); // Envio de datos al servidor (insertar datos en la base)
// app.put(); // Actualizacion
// app.delete(); // Eliminacion

app.use(express.json());  // Le decimos a Express que use este
                        // middlewere

app.use(express.urlencoded({extended:true}));   // Nuevo middleware
                                                // Define el uso de la libreria qs para
                                                // separar la informacion codificada eb
                                                // el url

app.use(express.static('public'));; // Nombre de la carpeta que tendra los archivos
                                    // (recursos estaticos)

console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`DB server: ${config.get('configDB.host')}`);

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    // console.log('Morgan habilitado...');
    // Muestra el mensaje de depuracion
    inicio_Debug('Morgan esta habilitado');
}

dbDebug('Conectando con la base de datos...');

// app.use(logger); // logger ya hace referencia a la funcion log de logger.js
//                 // debido al exports                        

// app.use(function(req, res, next){
//     console.log('Autenticando...');
//     next();
// });

// Los 3 app.use() son middleware y se llaman antes de
// las funciones de ruta GET, POST, PUT, DELETE
// para que estas puedan trabajar

const usuarios = [
    {id:1, nombre: 'Paola'},
    {id:2, nombre: 'Dora'},
    {id:3, nombre: 'Vanessa'},
    {id:4, nombre: 'Alondra'}
];

function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)))
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string()
                    .min(3)
                    .required()
    });
    return (schema.validate({nombre:nom}));
};

// Consulta en la ruta raiz del sitio
// Toda peticion siempre va a recibir 2 parametros
// req: la informacion que recibe el servidor desde el cliente
// res: la informacion que el servidor va a responder al cliente
// Vamos a utilizar el metodo send del objeto res
app.get('/',(req, res) =>{
    res.send('Hola mundo desde Express!');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

// Con los : delante del id
// Express sabe que es un parametro a recibir en la ruta
// En el cuerpo del objeto req esta la propiedad
    // params, que guarda los paramertros enviados.
    // Los parametros en req.params se reciben como strings
app.get('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    let usuario = existeUsuario(id);
    if (!usuario)
        res.status(404).send(`El usuario ${id} no se encuentra!`);
        // Devuelve el estado HTTP 404
    res.send(usuario);
});

// Recibiendo varios parametros
// Se pasan 2 parametros year y month
// Query string
// localhost:5000/api/usuarios/2002/2?nombre=xxxx&single=y
app.get('/api/usuarios/:year/:month', (req, res) => {
    // En el cuerpo de req que esta la propiedad
    // query, que guarda los parametros Query string
    res.send(req.query);
});

// La ruta tiene el mismo nombre que la peticion GET
// Express hace la diferencia dependiendo del tipo
// de peticion
// La peticion POST la vamos a utilizar para insertar
// un nuevo usuario en nuestro arreglo
app.post('/api/usuarios', (req, res) =>{
    // El objeto request tiene la propiedad body
    // que va a venir en formato JSON
    // Creacion del schema con joi
    const schema = Joi.object({
        nombre: Joi.string()
                    .min(3)
                    .required()
    });
    const {error, value} = schema.validate({nombre: req.body.nombre});
    if(!error){
        const usuario = {
            id: usuarios.length + 1,
            nombre: req.body.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }
    else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
    }
    return;    
});

// La peticion para modificar datos existentes
// Este metodo debe recibir un parametro
// id para saber que usuario modificar
app.put('/api/usuarios/:id', (req, res) =>{
    // encontrar si existe el usuario a modificar
    let usuario = existeUsuario(req.params.id);
    if (!usuario){
        res.status(404).send('El usuario no se encuentra'); // Devuelve el estado HTTP
        return;
    }
    // validar si el dato recibido es correcto
    const {error, value} = validarUsuario(req.body.nombre);
    if (!error){
        // Actualiza el nombre
        usuario.nombre = value.nombre;
        res.send(usuario);
    }
    else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
    }
    return;
});

// Recibe como parametro el id del usuario
// que se va a eliminar
app.delete('/api/usuarios/:id', (req, res) => {
    const usuario = existeUsuario(req.params.id);
    if (!usuario){
        res.status(404).send(`El usuario no se encuentra`); // Devuelve el estado HTTP
        return;
    }
    // Encontrar el indice del usuario dentro del arreglo
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1); // Elimina el usuario en el indice
    res.send(usuario); // se responde con el usuario eliminado
    return;
});

app.get('/api/productos', (req, res) => {
    res.send(['Mouse', 'Teclado', 'Bocinas']);
})

// El modulo process, contiene informacion del sistema
// El objeto env contiene informacion de las variables 
// de entorno.
// Si la variable PORT no existe, que tome un valor
// fijo definido por nosotros (3000)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
});

// ------------------- Funciones middleware ---------------------------
// El middleware es un bloque de codigo que se ejecuta entre las peticiones
// del usuario (request) y la peticion que llega al servidor. Es un enlace 
// entre la peticion del usuario y el servidor, antes de que este pueda
// dar una respuesta.

// Las funciones de middleware son funciones que tienen acceso al objeto de 
// solicitud (req), al objeto de respuesta (res) y a la siguiente funcion
// de middleware en el ciclo de solicitud/respuestas de la apliacion. La
// siguiente funcion middleware se denota normalmente con una variable
// denonima next.

// Las funciones de middleware pueden realizar las siguientes tareas:

// -- Ejecutar cualquier codigo.
// -- Realizar cambio en la solicitud y los objetos de respuesta
// -- Finalizar el ciclo de solicitud/respuesta
// -- Invoca la siguiente funcion de middlware en la pila

// Express es un framework de direccionamiento y uso de middleware
// que permite que la aplicacion tenga funcionalidad minima propia.
// Ya hemos utilizado algunos middleware como son express.json()
// que transforma el body del req a formato JSON

//             --------------------------
// request ---|--> JSON() --> route() --|--> response
//             --------------------------

// route() --> Function Get, POST, PUT, DELETE

// Una aplicacion Express puede utilizar los siguientes tipos 
// de middleware
//      - middleware de nivel de aplicacion
//      - middleware de nivel de direccionador
//      - middlewarede de manejo de errores
//      - middleware incorporado
//      - middleware de terceros

// ------------------- Recursos Estaticos ---------------------------
// Los recursos estaticos hacen referencia a archivos,
// imagenes, documentos que se ubican en el servidor.
// Vamos a usar un middleware para poder acceder a esos
// recursos.