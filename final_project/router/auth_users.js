const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!authenticatedUser(username, password))
    return res
      .status(300)
      .json({ message: "Provide correct username and password" });

  let accessToken = jwt.sign(
    {
      data: password,
    },
    "access",
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = {
    accessToken,
    username,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  console.log(username, review);

  if (isbn > 0 && review) {
    let book = books[isbn];
    if (!book) return res.status(300).json({ message: "No book" });

    books[isbn].reviews = { ...books[isbn].reviews, [username]: review };
    return res.status(200).json({
      message: "Review added/updated successfully",
      book: books[isbn],
    });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if (isbn > 0) {
    let book = books[isbn];
    if (!book) return res.status(300).json({ message: "No book" });
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      book: books[isbn],
    });
  }
  return res.status(300).json({ message: "No book" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
