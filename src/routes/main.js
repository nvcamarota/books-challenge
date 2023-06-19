const express = require('express');
const mainController = require('../controllers/main');
const guest = require('../middlewares/guest');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', auth, mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', guest, mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', guest, mainController.login);
router.post('/users/login', mainController.processLogin);
router.delete('/books/:id', mainController.deleteBook);
router.get('/books/edit/:id', auth, mainController.edit);
router.put('/books/edit/:id', mainController.processEdit);
router.get('/users/logout', mainController.logout);

module.exports = router;
