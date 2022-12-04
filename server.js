const express = require("express");
const mysql = require("mysql");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();

// dynamically change HTML pages using ejs
// https://www.geeksforgeeks.org/how-to-dynamically-add-html-content-when-documents-are-inserted-in-collection-using-node-js/
app.set('view engine', 'ejs');
// AWS RDB login information; do not touch
const con = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    multipleStatements: true
});
// initialize db and populate tables with data (see initdb.sql file)
// DO NOT USE COMMENTS IN initdb.sql FILE
const sql = fs.readFileSync("initdb.sql").toString();
con.connect(function (err) {
    if(err) {
        console.error("failed to connect to db");
    }
    console.log("Connected to class db");
    con.query(sql, function (err, result) {
        //if(err) throw err;
        console.log("Result: " + result);
    });
});

// default page for user
app.get("/", async (req, res) => {
    res.render("home");
});
// fetch and display classes to user from database
// TODO: make it prettier (currently formatted to work with HTML lists, probably should be a table)
app.get("/scheduler", async (req, res) => {
    con.query("SELECT * FROM classes", function (err, result) {
        //if(err) throw err;
        classList = result;
        console.log("Result: " + result);
        // if result list is null, replace with "problem fetching classes!"
        result = result ? result : "problem fetching classes from db!";
        // TODO: let user input values into an HTML form to select classes from list to sign up for
        // establish new table for each user?? idk
        res.render("scheduler", {classes: result});
    });
});
// TODO: implement login function for students to save their class selection (STRETCH GOAL)
app.get("/login", async (req, res) => {

});

const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});