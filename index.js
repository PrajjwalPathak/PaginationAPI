const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { paginateUsers, searchUsers } = require("./controllers/userController");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));

// view-engine
app.set("views", "./views");
app.set("view engine", "ejs");
mongoose.set("strictQuery", true);

// db Connection
mongoose
	.connect("mongodb://localhost:27017/login_api_db")
	.then(() => {
		app.listen(PORT, () => {
			console.log("Server running on port " + PORT);
		});
	})
	.catch((error) => {
		console.log(error);
	});

app.get("/users", paginateUsers);

app.get("/users/search", searchUsers);

app.get("/", (req, res) => {
	res.render("index.ejs");
});

// app.get("/pagination", (req, res) => {
// 	res.render("pagination.ejs");
// });

// app.get("/users/search", (req, res) => {
// 	res.render("search_filter.ejs");
// });