const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log("Trigger", username, password);
  console.log(users);
  if (username && password) {
    let userswithsamename = users.filter((user) => (user.username = username));
    if (userswithsamename.length > 0)
      return res.status(300).json("Username already exists");
    let newUser = { username, password };
    users = users.push(newUser);
    console.log(users);
    return res.status(200).json("User regsitered successfully");
  } else {
    res.status(300).json("Procide the details");
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let allBooks = JSON.stringify(books, null, 4);

  return res.status(200).json(allBooks);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn <= 0) return;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(300).json("No book");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let allBooks = Object.values(books);
  let book = allBooks.filter((book) => book.author === author);
  if (book.length >= 1) {
    return res.status(200).json(book);
  } else {
    return res.status(300).json("No books by this author in the database");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let allBooks = Object.values(books);
  let book = allBooks.filter((book) => book.title === title);
  if (book.length >= 1) {
    return res.status(200).json(book);
  } else {
    return res.status(300).json("No books by this title in the database");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn <= 0) return;
  let book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(300).json("No book");
  }
});

async function getAllBooksAsync() {
  try {
    const url = `http://localhost:5000/`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Unexpected error");
    throw error;
  }
}

async function getBookByISBNAsync(isbn) {
  try {
    const url = `http://localhost:5000/isbn/${isbn}`;
    const response = await axios.get(url);

    console.log("Book details retrieved successfully:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
}

async function getBookByAuthorAsync(author) {
  try {
    const url = `http://localhost:5000/author/${author}`;
    const response = await axios.get(url);

    console.log("Book details retrieved successfully:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
}

async function getBookByTitleAsync(author) {
  try {
    const url = `http://localhost:5000/title/${title}`;
    const response = await axios.get(url);

    console.log("Book details retrieved successfully:");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching book details:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
    throw error;
  }
}

module.exports.general = public_users;
