const express = require('express');
const Joi = require('joi')
const ruta = express.Router();

const consolas = [
    {id:1, nombre: 'XBOX'},
    {id:2, nombre: 'PS5'},
    {id:3, nombre: 'Nintendo'},
];

ruta.get('/', (req, res) => {
    res.send(consolas);
});

ruta.get('/:id', (req, res) => {
    const id = req.params.id;
    let consola = existeConsola(id);
    if (!consola)
        res.status(404).send(`La consola ${id} no se encuentra!`);
        // Devuelve el estado HTTP 404
    res.send(consola);
});

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
        const consola = {
            id: consolas.length + 1,
            nombre: req.body.nombre
        };
        consolas.push(consola);
        res.send(consola);
    }
    else{
        const mensaje = error.details[0].message
        res.status(400).send(mensaje);
    }
    return;    
});

ruta.put('/:id', (req, res) =>{
    // encontrar si existe el consola a modificar
    let consola = existeConsola(req.params.id);
    if (!consola){
        res.status(404).send('El consola no se encuentra'); // Devuelve el estado HTTP
        return;
    }
    // validar si el dato recibido es correcto
    const {error, value} = validarConsola(req.body.nombre);
    if (!error){
        // Actualiza el nombre
        consola.nombre = value.nombre;
        res.send(consola);
    }
    else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
    }
    return;
});

ruta.delete('/:id', (req, res) => {
    const consola = existeConsola(req.params.id);
    if (!consola){
        res.status(404).send(`El consola no se encuentra`); // Devuelve el estado HTTP
        return;
    }
    // Encontrar el indice del consola dentro del arreglo
    const index = consolas.indexOf(consola);
    consolas.splice(index, 1); // Elimina el consola en el indice
    res.send(consola); // se responde con el consola eliminado
    return;
});

function existeConsola(id){
    return (consolas.find(c => c.id === parseInt(id)))
}

function validarConsola(nom){
    const schema = Joi.object({
        nombre: Joi.string()
                    .min(3)
                    .required()
    });
    return (schema.validate({nombre:nom}));
};

module.exports = ruta; // Se exporta el objeto ruta