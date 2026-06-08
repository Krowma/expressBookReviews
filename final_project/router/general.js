const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((data) => res.send(JSON.stringify(books,null,4)))
        .catch((err) => res.status(404).json({ message: err }));
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const getBooksByIsbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
    }); 

    getBooksByIsbn
        .then((data) => res.json(data))
        .catch((err) => res.status(404).json({ message: err })); 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const author = req.params.author;
        const filteredBooks = Object.values(books).filter(b => b.author === author);
        if (filteredBooks.length > 0) resolve(filteredBooks);
        else reject("No books found by this author");
    });

    getBooksByAuthor
        .then((data) => res.json(data))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const getBooksByTitle = new Promise((resolve, reject) => {
        const title = req.params.title;
        const filteredBooks = Object.values(books).filter(b => b.title === title);
        if (filteredBooks.length > 0) resolve(filteredBooks);
        else reject("No books found by this title");
    });

    getBooksByTitle
        .then((data) => res.json(data))
        .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book)
    {
        if(Object.keys(book.reviews).length === 0 )
        {
            res.status(200).json({ message: "No reviews found for this book."});
        }
        else{
            res.send(book.reviews);
        }
    }
    else{
        res.status(404).json({ message: "Unable to find book."});
    }
});

module.exports.general = public_users;
