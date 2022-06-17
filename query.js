const Pool = require('pg').Pool;
require("dotenv").config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production"
});

queryById(1, (error, results) => {
	if (error) throw error;
	if (!results.rows.length) {
		pool.query("CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(255), email VARCHAR(255));", (error, results) => {
			if (error) throw error;
			return; //Silent success
		});
	}
});

function find(req, res) {
	pool.query(`SELECT * FROM users`, (error, results) => {
		if (error) throw error;
		res.status(200).json(results.rows);
	});
}

function findOne(req, res) {
	queryById(req.params.id, (error, results) => {
		if (error) throw error;
		res.status(200).json(results.rows);
	});
}
function queryById(id, callback) {
	pool.query(`SELECT * FROM users WHERE id=$1`, [id], callback);
}

function createUser(req, res) {
  const { name, email } = req.body;

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
    if (error) throw error;
    res.status(201).json({
			id: results.rows[0].id,
			name,
			email,
			message: "success"
		});
  });
}

function updateUser(req, res) {
	const { id } = req.params;
  const { name, email } = req.body;

	queryById(id, (error, results) => {
		if (error) throw error;
		if (!results.rows.length) {
			return res.status(404).json({
				message: `failure - record with id ${id} doesn't exist!`
			});
		}
		pool.query(
			'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
			[name, email, id],
			(error, results) => {
				if (error) throw error;
				res.status(200).send(results.rows);
			}
		);
	});
}

function patchUser(req, res) {
	const { id } = req.params;
  let { name, email } = req.body;

	queryById(id, (error, results) => {
		if (error) throw error;
		if (!results.rows.length) {
			return res.status(404).json({
				message: `failure - record with id ${id} doesn't exist!`
			});
		}
		name = name || results.rows[0].name;
		email = email || results.rows[0].email;
		pool.query(
			`UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *`,
			[name, email, id],
			(updateError, updateResults) => {
				if (updateError) throw updateError;
				res.status(200).send(updateResults.rows);
			}
		);
	});
}

function deleteUser(req, res) {
	const { id } = req.params;

	queryById(id, (error, results) => {
		if (error) throw error;
		if (!results.rows.length) {
			return res.status(404).json({
				message: `failure - record with id ${id} doesn't exist!`
			});
		}
		pool.query(
			`DELETE FROM users WHERE id=$1`,
			[id],
			(error, results) => {
				if (error) throw error;
				res.status(200).json({
					message: `success - record with id ${id} was deleted`
				});
			}
		);
	});
}

module.exports = {
	find,
	findOne,
	createUser,
	deleteUser,
	updateUser,
	patchUser
};