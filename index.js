const express = require("express");

const server = express();

server.use(express.json());

const users = ["Diego", "Carlos", "Vitor"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

function checkUserExistis(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Username is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exist!" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUserExistis, (req, res) => {
  const name = req.body.name;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserExistis, checkUserInArray, (req, res) => {
  const index = req.params.index;
  const name = req.body.name;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const index = req.params.index;

  users.splice(index, 1);

  return res.json();
});

server.listen(3000);
