function log(req, res, next){
    console.log('logging...');
    next(); // Le indica a express que llame la siguiente funcion middleware
            // o la peticion correspondiente
            // Si no lo indicamos, Express se queda dentro de esta función
}

module.exports = log;