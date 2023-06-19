const express = require('express');
const app = express();
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');


// URL Encode 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));


// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', 'src/views');


// Cookies & Session
app.use(cookieParser());
app.use(
  session({
    secret: 'Books Challenge',
    resave: false,
    saveUninitialized: false,
  })
);


// Middlewares
const logged = require('./middlewares/logged');
app.use(logged);


// Controllers
const mainRouter = require('./routes/main');
app.use('/', mainRouter);


// Server - npm run test
app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
