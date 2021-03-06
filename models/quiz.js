var models = require('../models/models.js');
var temas = models.temas;

// Definición del modelo de Quiz con validación
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
          {
            pregunta: {
                type: DataTypes.STRING,
                validate: { notEmpty: { args: true, msg: "->Falta Pregunta" } }
            },
            respuesta: {
                type: DataTypes.STRING,
                validate: { notEmpty: { args: true, msg: "->Falta Respuesta" } }
            },
            tema: {
                type: DataTypes.STRING,
                validate: {
                  notEmpty: {
                    args: true,
                    msg: "->Falta Tema"
                  },
                  isIn:     {
                    args: [ temas ],
                    msg: "->Tema Incorrecto"
                  }
                }
            }
          });
}
