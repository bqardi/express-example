const express = require("express");
const app = express();
const path = require("path");
const { find, findOne, createUser } = require('./query');

// Getting the API data from a json file
const data = require("./data.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Return/display the default index.html file (the documentation)
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Return all json data
app.get("/api/hello", (req, res) => {
	res.send(data);
});

// Return a single item from the json data (example: /api/hello/1))
app.get("/api/hello/:myid", (req, res) => {
	const id = req.params.myid;
	const item = data.find(obj => obj.id === id);
	res.send(item);
});

// Return all users from database
app.get("/api/users", find);

// Return user from database
app.get("/api/users/:id", findOne);

// Create user in database
app.post("/api/users", createUser);

app.listen(3000, () => console.log("Server is listening on port 3000"));