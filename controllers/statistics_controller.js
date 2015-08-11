var models = require('../models/models.js');

// MW para estadísticas
exports.show = function (req, res, next) {
  var statistics = { numQuizes: 0,
                     numComments: 0,
                     numCommentsPublished: 0,
                     numCommentsNotPublished: 0,
                     avgComments: 0,
                     numQuizesWithComments: 0,
                     numQuizesWithoutComments: 0 };

  // Número de preguntas
  models.Quiz.count()
  .then ( function(numQuizes ) {

    if ( numQuizes !== 0 ) {

      statistics.numQuizes = numQuizes;

      // Número de comentarios
      models.Comment.count()
      .then ( function(numComments) {

        statistics.numComments = numComments;
        statistics.avgComments = (numComments/numQuizes).toFixed(2);

        // Número de comentarios publicados
        models.Comment.count( { where: { publicado: true } } )
        .then( function(numCommentsPublished) {

          statistics.numCommentsPublished = numCommentsPublished;

          // Número de comentarios no publicados
          statistics.numCommentsNotPublished = numComments - numCommentsPublished;

          // Número de preguntas con comentarios
          models.Quiz.count({
              include: [
                  {
                      model: models.Comment,
                      required: true
                  }
              ],
              distinct: true
           })
          .then ( function(numQuizesWithComments) {

            statistics.numQuizesWithComments = numQuizesWithComments;

            // Número de preguntas sin comentarios
            statistics.numQuizesWithoutComments = numQuizes - numQuizesWithComments;

            // Renderización
            res.render('quizes/statistics', { statistics: statistics , errors: [] });

          }).catch(function(error){ next(error); });
        }).catch(function(error){ next(error); });
      }).catch(function(error){ next(error); });

      // Si no preguntas se renderizará con todos los valores a cero
    } else res.render('quizes/statistics', { statistics: statistics , errors: [] });

  }).catch(function(error){ next(error); });
};
