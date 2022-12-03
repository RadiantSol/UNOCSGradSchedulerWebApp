const express = require("express");
const mysql = require("mysql");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();

// dynamically change HTML pages using ejs
// https://www.geeksforgeeks.org/how-to-dynamically-add-html-content-when-documents-are-inserted-in-collection-using-node-js/
app.set('view engine', 'ejs');
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
    });
});

// default page for user
app.get("/", async (req, res) => {
    res.render("home");
});

app.get("/scheduler", async (req, res) => {
    con.connect(function (err) {
        if(err) throw err;
        console.log("Connected to class db");
        con.query("SELECT * FROM classes", function (err, result) {
            if(err) throw err;
            classList = result;
            console.log("Result: " + result);
            // if result list is null, replace with "problem fetching classes!"
            result = result ? result : "problem fetching classes from db!";
            res.render("scheduler", {classes: result});
        });
    });
});

const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});