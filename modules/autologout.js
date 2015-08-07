// Middleware para hacer autologout si el tiempo es mayor
// entre petición y petición al tiempo pasado en milisegundos
// o si es mayor a dos minutos si no le pasamos parametro alguno
var defaultTime = 120000; // 2 minutos = 2*60*1000 milisegundos
module.exports = function(maxTime) {

  return function(req, res, next) {
    // Sólo si ha hecho login haremos logout.
    if (req.session.user) {
      // Si recibe un tiempo de logout usará ese valor si no será el valor por defecto
      var logoutTime = maxTime || defaultTime;
      // Tiempo transacción actual
      var now = new Date().getTime();
      // // Tiempo transacción anterior
      req.session.lastTime = req.session.lastTime || now;
      // Se compara el tiempo actual con el de la transacción anterior, y si es mayor del
      // tiempo establecido para el autologout se hace un logout
      if ( (now - req.session.lastTime) >= logoutTime ) {
        req.session.lastTime= null;
        res.redirect('/logout');
      } else { req.session.lastTime = now; } // El tiempo de la actual transacción será el último para la siguiente
    }
    // Pasar al siguiente middleware
    next();
  }
}
