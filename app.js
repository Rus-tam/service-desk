let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const expressHbs = require('express-handlebars');
const adminRoutes = require('./routes/admin');
const serviceDeskRoutes = require('./routes/serviceDesk');
const authRoutes = require('./routes/auth');

let app = express();

//Define [ath for Express config
const partialPath = path.join(__dirname, './views/layouts/');

// view engine setup
app.engine('hbs', expressHbs({
  extname: 'hbs',
  layoutsDir: 'views/layouts/',
  defaultLayout: 'mainLayout'
}))
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(adminRoutes)
app.use(serviceDeskRoutes);
app.use(authRoutes);

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

module.exports = app;
