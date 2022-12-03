const express = require("express");
const mysql = require("mysql");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();
const con = mysql.createConnection({
    host: "localhost",
    user: "MasterUser",
    password: "nzm3twz7TVU9dje!muy",
    multipleStatements: true
});
// initialize db and populate tables with data (see initdb.sql file)
// DO NOT USE COMMENTS IN initdb.sql FILE
const sql = fs.readFileSync("initdb.sql").toString();
con.connect(function (err) {
    if(err) throw err;
    console.log("Connected to class db");
    con.query(sql, function (err, result) {
        if(err) throw err;
        console.log("Result: " + result);
    })
});

// default page for user
app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/pages/home.html");
});

app.get("/test", async (req, res) => {
    res.send("Youre not supposed to see this!");
})

// helper function to initialize database and populate tables

const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});