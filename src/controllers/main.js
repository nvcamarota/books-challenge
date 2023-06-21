const bcryptjs = require('bcryptjs');
const db = require('../database/models');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{
        association: 'authors'
      }],
    })
      .then((books) => {
        res.render('home', {
          books,
          designation: 'Books'
        });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database
    db.Book.findByPk(req.params.id, {
      include: [{
        association: 'authors'
      }]
    }).then((book) => {
      res.render('bookDetail', {
        book,
        user: req.session.userLogged,
        designation: 'Book Detail'
      });
    })
      .catch((error) => console.log(error));
  },
  bookSearch: (req, res) => {
    res.render('search', {
      books: [],
      designation: 'Search'
    });
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    let title = req.body.title;
    const condition = title ? { [db.Sequelize.Op.like]: `%${title}%` } : null;

    db.Book.findAll({
      include: [{
        association: 'authors'
      }],
      where: {
        title: condition
      },
    })
      .then((books) => {
        if (books.length > 0) {
          res.render('search', {
            books, 
            designation: title
          });
        } else {
          res.render('search', {
            books: [],
            designation: title
          });
        }
      });
  },
  deleteBook: (req, res) => {
    // Implement delete book
    let bookId = req.params.id;

    db.BooksAuthors.destroy({
      where: {
        BookId: bookId
      },
      force: true
    }).then(() => {
      db.Book.destroy({
        where: {
          id: bookId
        }
      });
    }).then(() => {
      return res.redirect('/');
    })
      .catch((error) => res.send(error));
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', {
          authors,
          designation: 'Authors'
        });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    let ide = req.params.id;
    const condition = ide ? { [db.Sequelize.Op.like]: `%${ide}%` } : null;

    db.Author.findAll({
      include: [{
        association: 'books'
      }],
      where: {
        id: condition
      },
    }).then((authors) => {
      console.log(JSON.stringify(authors, null, 2));

      res.render('authorBooks', {
        authors
      });
    })
      .catch((error) => console.log(error));
  },
  register: (req, res) => {
    res.render('register', {
      designation: 'User Register'
    });
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category,
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login', {
      designation: 'User Log in'
    });
  },
  processLogin: (req, res) => {
    // Implement login process
    let toLogin = db.User.findOne({
      where: {
        email: req.body.email
      }
    });
    Promise.all([
      toLogin
    ]).then(([toLogin]) => {
      if (toLogin) {
        let passwordOk = bcryptjs.compareSync(
          req.body.password,
          toLogin.Pass
        );

        if (passwordOk) {
          delete toLogin.Pass;
          req.session.userLogged = toLogin;

          if (req.body.remember_user) {
            res.cookie('booksUser', req.body.email, { maxAge: 1000 * 60 * 60 });
          }

          return res.redirect('/');
        }

        return res.render('login', {
          errors: {
            email: {
              msg: 'Credenciales inválidas'
            },
          },
        });
      }

      return res.render('login', {
        errors: {
          email: {
            msg: 'No se encuentra este usuario'
          },
        },
      });
    });
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findByPk(req.params.id, {
      include: [{
        association: 'authors'
      }],
    }).then((book) => {
      res.render('editBook', {
        book,
        user: req.session.userLogged,
        designation: 'Edit Book'
      });
    })
      .catch((error) => console.log(error));
  },
  processEdit: (req, res) => {
    // Implement edit book
    let bookId = req.params.id;
    db.Book.update({
      title: req.body.title,
      cover: req.body.cover,
      description: req.body.description,
    },
      {
        where: {
          id: bookId
        },
      }
    ).then(() => {
      return res.redirect('/');
    })
      .catch((error) => {
        console.log(error);
      });
  },
  logout: (req, res) => {
    res.clearCookie('booksUser');
    req.session.destroy();
    return res.redirect('/');
  },
};

module.exports = mainController;
