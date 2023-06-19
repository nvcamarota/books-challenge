const db = require('../database/models');

module.exports = (req, res, next) => {
  res.locals.isLogged = false;

  let cookieEmail = req.cookies.booksUser;
  if (cookieEmail != undefined && req.session.userLogged == undefined) {
    db.User.findOne({
      where: {
        Email: cookieEmail,
      },
    })
      .then((user) => {
        req.session.userLogged = user;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged;
  }
  next();
}