const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const app = express();

// dynamically change HTML pages using ejs
// https://www.geeksforgeeks.org/how-to-dynamically-add-html-content-when-documents-are-inserted-in-collection-using-node-js/
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views/media')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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

// class list for debugging purposes
const debug = [{areaOfStudy: "blah", department: "csci", id: "6000", classname: "wowee class", credithours: "3"},
{areaOfStudy: "blah", department: "csci", id: "6000", classname: "wowee class", credithours: "3"}];

// default page for user
app.get("/", async (req, res) => {
    res.render("home");
});
// fetch and display classes to user from database
app.get("/scheduler", async (req, res) => {
    con.query("SELECT * FROM classes", function (err, result) {
        //if(err) throw err;
        console.log("Result: " + result);
        // if result list is null, replace with debug class list
        result = result ? result : debug;
        res.render("scheduler", {classes: result});
    });
});

// display user's classes from submitted form from /scheduler
app.post("/scheduler", async (req, res) => {
    // do degree requirement checks on selected classes and pass results to validators list
    let validators = {
        breadth: false, 
        depth: false, 
        hours: false
    };
    // two objects, one holding course association with area, other holding course count of each area
    let takenCourses = {};
    let areas = {};
    console.log(typeof req.body.class)
    if(typeof req.body.class == "string") {
        let args = req.body.class.split(" ");
        takenCourses[args[1]] = args[0];
        areas[args[0]] = 1;
    }
    else {
        req.body.class.forEach(function (course) {
            let args = course.split(" ");
            // if the chosen courses aren't duplicates, add to the list of taken areas and courses (some courses cover multiple areas, but only count for one)
            if(!(args[1] in takenCourses)) {
                takenCourses[args[1]] = args[0];
                areas[args[0]] = areas[args[0]] + 1 || 1;
            }
        });
    }
    // validator logic to check for satisfied breadth, depth, and credit hour requirements
    let totalAreas = Object.keys(areas).length;
    let hours = 0;
    if(totalAreas >= 3) {
        validators.breadth = true;
        areas.keys().forEach(function (key) {
            hours += areas[key] * 3;
            if(areas[key] >= 3) {
                validators.depth = true;
            }
        });
    }
    if(hours >= 36) {
        validators.hours = true;
    }

    let multiStatement = "";
    takenCourses.forEach(function (course) {
        let prepStatement = "SELECT * FROM classes WHERE id = " + mysql.escape(course);
        prepStatement += " AND areaOfStudy = " + mysql.escape(takenCourses[course]) + " UNION ";
        multiStatement += prepStatement;
    });
    // crop out hanging UNION from statement
    multiStatement = multiStatement.substring(0, (multiStatement.length() - 1) - 7);

    con.query(multiStatement, function(err, result) {
        //if(err) throw err;
        console.log("Result: " + result);
        result = result ? result : debug;
        res.render("coursecheck", {classes: result, valid: validators});
    });
});
// TODO: implement login function for students to save their class selection (STRETCH GOAL)
app.get("/login", async (req, res) => {

});

app.all("/*", async (req, res) => {
    res.send("You're not supposed to be here!");
});

const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);
});