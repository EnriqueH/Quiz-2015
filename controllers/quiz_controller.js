var models = require('../models/models.js');

var temas = models.temas;

// Autoload- factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error){next(error);});
};

// GET /quizes    GET /quizes?search=texto_a_buscar
exports.index = function(req, res) {
  if (req.query.search) {
    var search = '%' + req.query.search.replace(/\s/g, '%') + '%';
    models.Quiz.findAll(
      {
        where: { pregunta: { like: search } },
        order: [ [ 'pregunta', 'ASC' ] ]
      }
    ).then(function(quizes){
      res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
    }).catch(function(error){next(error);});
  } else {
    models.Quiz.findAll().then(function(quizes){
      res.render('quizes/index.ejs', { quizes: quizes, errors: [] });
    }).catch(function(error){ next(error); });
  }

};

//GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( //Crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Otro"}
  );
  res.render('quizes/new', {quiz: quiz, errors:[], temas: temas });
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  quiz
  .validate()
  .then( function(err) {
            if (err) {
              res.render('quizes/new', {quiz: quiz, errors: err.errors, temas: temas });
            } else {
              quiz
                // guarda en DB los campos pregunta y respuesta de quiz
                .save({fields: ["pregunta", "respuesta", "tema"]})
                //Redirección HTTP (URL relativo) lista de preguntas
                .then (function(){res.redirect('/quizes')})
            }
        }
  );
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz; // autoload de instancia de quiz

  res.render('quizes/edit', { quiz: quiz, errors: [], temas: temas });
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then( function(err) {
            if (err) {
              res.render('quizes/edit', {quiz: req.quiz, errors: err.errors, temas: temas });
            } else {
              req.quiz
                // guarda en DB los campos pregunta y respuesta de quiz
                .save({fields: ["pregunta", "respuesta", "tema"]})
                //Redirección HTTP (URL relativo) lista de preguntas
                .then (function(){res.redirect('/quizes')})
            }
        }
  );
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(function(){
    res.redirect('/quizes');
  }).catch(function(error) { next(error)});
};
