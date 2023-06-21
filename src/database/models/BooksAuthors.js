module.exports = (sequelize, dataTypes) => {
    let alias = 'BooksAuthors';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        AuthorId: {
            type: dataTypes.INTEGER
        },
        BookId: {
            type: dataTypes.INTEGER
        }
    };
    let config = {
        tableName: 'booksauthors',
        timestamps: false
    };

    const BooksAuthors = sequelize.define(alias, cols, config);

    return BooksAuthors;
};