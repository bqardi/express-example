const express = require("express");
const app = express();
const path = require("path");
const { find, findOne, createUser, deleteUser, updateUser, patchUser } = require('./query');
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Getting the API data from a json file
const data = require("./data.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Queries from data.json file (read only)
app.get("/api/json", (req, res) => res.send(data));
app.get("/api/json/:id", (req, res) => {
	const id = req.params.id;
	const item = data.find(obj => obj.id === id);
	res.send(item);
});

// PostgreSQL operations
app.get("/api/users", find);
app.get("/api/users/:id", findOne);
app.post("/api/users", createUser);
app.delete("/api/users/:id", deleteUser);
app.put("/api/users/:id", updateUser);
app.patch("/api/users/:id", patchUser);

// Download handling
app.get("/downloads/:filename", (req, res) => {
	const file = path.join(__dirname, "downloads", req.params.filename);
	res.status(200).download(file);
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));