var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // Importa cors

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var veicoliRouter = require('./routes/veicoli');
var corseRouter = require('./routes/corse');
var assegnazioniRouter = require('./routes/assegnazioni');
var exportRouter = require('./routes/export');

var app = express();

// Configurazione CORS
app.use(cors({
  origin: 'http://localhost:5000', // Permette solo richieste da localhost:5000
  credentials: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/autisti', usersRouter);
app.use('/veicoli', veicoliRouter);
app.use('/corse', corseRouter);
app.use('/assegnazioni', assegnazioniRouter);
app.use('/export', exportRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let port = 3000;  // Porta diversa da quella del frontend
app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`);
});

// Esporta l'istanza dell'app
module.exports = app; // Aggiungi questa riga

