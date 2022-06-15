const Pool = require('pg').Pool;
require("dotenv").config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production"
});

function find(req, res) {
	pool.query(`SELECT * FROM users`, (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
}

function findOne(req, res) {
	pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
}

function createUser(req, res) {
	console.log(req.body)
  const { name, email } = req.body;

  pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
    if (error) {
      throw error
    }
    res.status(201).json({
			id: results.rows[0].id,
			name,
			email,
			message: "success"
		})
  })
}

module.exports = { find, findOne, createUser };