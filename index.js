//Backend(Node JS)

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require('bcrypt'); // https://www.npmjs.com/package/bcrypt npm i bcrypt
var jwt = require('jsonwebtoken'); //https://github.com/auth0/node-jsonwebtoken npm install jsonwebtoken
const app = express();
const port = 3000;

app.use(express.json());

const con = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "7788",
  database: "ems-nodejs",
});
con.connect(function (err) {
  if (err) {
    console.log(err);
    console.log("Error in Connection");
  } else {
    console.log("Connected");
  }
});

//test
app.get("/", (req, res) => {
  res.send("Hello World new node project!");
});

//filter by id

app.get("/get/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee where id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get employee error in sql" });
    return res.json({ Status: "Success", Result: result });
  });
});

//delete
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE from employee WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Delete Error!!" });
    return res.json({ Status: "Deleted Successfully!" });
  });
});

//update
app.put("/update/:id", (req, res) => {
  const userId = req.params.id;
  const sql =
    "UPDATE employee SET `name`=?, `address`=?, `contact`=? WHERE id=?";

  const values = [req.body.name, req.body.address, req.body.contact];

  con.query(sql, [...values, userId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

//Get Employees

app.get("/getEmployee", (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get employee error in sql" });
    return res.json({ Result: result });
  });
});

//Enroll Employees
app.post("/create", (req, res) => {
  const name = req.body.name;
  const address = req.body.address;
  const contact = req.body.contact;

  con.query(
    "INSERT INTO `ems-nodejs`.employee (name, address, contact) VALUES (?, ?, ?)",
    [name, address, contact],
    (err, result) => {
      if (result) {
        res.send(result);
        console.log(result);
      } else {
        res.send({ message: "ENTER CORRECT DETAILS!" });
      }
    }
  );
});

//get Employee Count
app.get("/employeeCount", (req, res) => {
  const sql = "Select count(id) as employee from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in runnig query" });
    return res.json(result);
  });
});

//for users table -> Register
app.post("/register", (req, res) => {
  const sql = "INSERT INTO users (`name`,`email`,`password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) return res.json({ Error: "Error in hashing password" });
    const values = [req.body.name, req.body.email, hash];
    con.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Error query", err });
      return res.json({ Status: "Success" });
    });
  });
});

//for login

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users Where email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err)
      return res.json({ Status: "Error", Error: "Error in runnig query" });
    if (result.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        result[0].password,
        (err, response) => {
          if (err) return res.json({ Error: "password error" });
          if (response) {
            const token = jwt.sign({ role: "admin" }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            return res.json({ Status: "Success", Token: token });
          } else {
            return res.json({
              Status: "Error",
              Error: "Wrong Email or Password",
            });
          }
        }
      );
    } else {
      return res.json({ Status: "Error", Error: "Wrong Email or Password" });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
