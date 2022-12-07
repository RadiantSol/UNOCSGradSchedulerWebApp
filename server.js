const express = require("express");
const mysql = require("mysql");
const fs = require("fs");
const path = require("path");
const { debug } = require("console");

const PORT = process.env.PORT || 8080;
const app = express();

// dynamically change HTML pages using ejs
// https://www.geeksforgeeks.org/how-to-dynamically-add-html-content-when-documents-are-inserted-in-collection-using-node-js/
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views/media')));
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
app.get("/scheduler", async (req, res) => {
    con.query("SELECT * FROM classes", function (err, result) {
        //if(err) throw err;
        console.log("Result: " + result);
        debug = [{areaOfStudy: "blah", department: "csci", id: "6000", classname: "wowee class", credithours: "3"},
        {areaOfStudy: "blah", department: "csci", id: "6000", classname: "wowee class", credithours: "3"}];
        // if result list is null, replace with debug class list
        result = result ? result : debug;
        res.render("scheduler", {classes: result});
    });
});

// display user's classes from submitted form from /scheduler
app.post("/scheduler", async (req, res) =>  {
    // con.query("SELECT * FROM classes WHERE id = ? AND areaOfStudy = ?") function(err, result) {
    //     if(err) throw err;
    //     console.log("Result: " + result);
    //     debug = [{areaOfStudy: "blah", department: "csci", id: "6000", classname: "wowee class", credithours: "3"},
    //     {areaOfStudy: "blah", department: "csci", id: "6000", classname: "wowee class", credithours: "3"}];
    //     result = result ? result : debug;
    //     res.render("coursecheck", {classes: result, valid: validators});
    // }
})
// TODO: implement login function for students to save their class selection (STRETCH GOAL)
app.get("/login", async (req, res) => {

});

const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});