const express = require('express');
const Joi = require('joi')
const ruta = express.Router();

const usuarios = [
    {id:1, nombre: 'Paola'},
    {id:2, nombre: 'Dora'},
    {id:3, nombre: 'Vanessa'},
    {id:4, nombre: 'Alondra'}
];

ruta.get('/', (req, res) => {
    res.send(usuarios);
});

// Con los : delante del id
// Express sabe que es un parametro a recibir en la ruta
// En el cuerpo del objeto req esta la propiedad
// params, que guarda los paramertros enviados.
// Los parametros en req.params se reciben como strings
ruta.get('/:id', (req, res) => {
    const id = req.params.id;
    let usuario = existeUsuario(id);
    if (!usuario)
        res.status(404).send(`El usuario ${id} no se encuentra!`);
        // Devuelve el estado HTTP 404
    res.send(usuario);
});

// La ruta tiene el mismo nombre que la peticion GET
// Express hace la diferencia dependiendo del tipo
// de peticion
// La peticion POST la vamos a utilizar para insertar
// un nuevo usuario en nuestro arreglo
ruta.post('/', (req, res) =>{
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
ruta.put('/:id', (req, res) =>{
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
ruta.delete('/:id', (req, res) => {
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

module.exports = ruta; // Se exporta el objeto ruta