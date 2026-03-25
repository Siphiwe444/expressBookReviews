const express = require('express');
const axios = require('axios'); // ✅ Added axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check if user exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Register user
  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered" });
});


// Get the book list available in the shop (USING AXIOS)
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});


// Get book details based on ISBN (USING AXIOS)
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const booksData = response.data;

    if (booksData[isbn]) {
      return res.json(booksData[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

  
// Get book details based on author (USING AXIOS)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const booksData = response.data;

    let result = {};

    Object.keys(booksData).forEach(isbn => {
      if (booksData[isbn].author.toLowerCase() === author.toLowerCase()) {
        result[isbn] = booksData[isbn];
      }
    });

    if (Object.keys(result).length > 0) {
      return res.json(result);
    }

    return res.status(404).json({ message: "No books found for this author" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});


// Get all books based on title (USING AXIOS)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/books');
    const booksData = response.data;

    let result = {};

    Object.keys(booksData).forEach(isbn => {
      if (booksData[isbn].title.toLowerCase() === title.toLowerCase()) {
        result[isbn] = booksData[isbn];
      }
    });

    if (Object.keys(result).length > 0) {
      return res.json(result);
    }

    return res.status(404).json({ message: "No books found with this title" });

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});


// Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.send(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});


module.exports.general = public_users;