//dependencies required for the app
var express = require("express");
var bodyParser = require("body-parser");
var CacheHelper = require("./caching/CacheHelper")
require('dotenv').config()


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

const db = require('./model/queries')

app.post("/addtask", async function(req, res) {
    const newTask = req.body.newtask;
    //add the new task from the post route
    await db.addTodo(newTask)
    res.redirect("/");
});

app.post("/removetask", async function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        await db.completeTodo(completeTask);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            await db.completeTodo(completeTask[i]);
            completeTask.splice(completeTask.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//render the ejs and display added task, completed task
app.get("/", async function(req, res) {
    let openTasks = await db.getTodos(true)
    let completedTasks = await db.getTodos(false)
    res.render("index", { task: openTasks, complete: completedTasks });
});

const port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("server is running on port: " + port);
});
