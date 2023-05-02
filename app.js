const inicio_Debug = require('debug')('app:inicio'); // Importar el paquete debug
                                    // El parametro indica el archivo y el entorno
                                    // de depuracion
const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios');
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

app.use('/api/usuarios', usuarios); // Middleware que importamos                                    
// El primer parametro que es la ruta raiz asociada
// con las peticiones a los datos de usuarios
// La ruta raiz se va a concatenar como prefijo
// al inicio de todas las rutas definidas en 
// el archivo usuarios

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


// Consulta en la ruta raiz del sitio
// Toda peticion siempre va a recibir 2 parametros
// req: la informacion que recibe el servidor desde el cliente
// res: la informacion que el servidor va a responder al cliente
// Vamos a utilizar el metodo send del objeto res
app.get('/',(req, res) =>{
    res.send('Hola mundo desde Express!');
});

// Recibiendo varios parametros
// Se pasan 2 parametros year y month
// Query string
// localhost:5000/api/usuarios/2002/2?nombre=xxxx&single=y
// app.get('/api/usuarios/:year/:month', (req, res) => {
//     // En el cuerpo de req que esta la propiedad
//     // query, que guarda los parametros Query string
//     res.send(req.query);
// });

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