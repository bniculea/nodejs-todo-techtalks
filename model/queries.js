const uuid = require('uuid');
const Pool = require('pg').Pool

const dbPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

dbPool.query(`CREATE TABLE IF NOT EXISTS todos(
				id uuid NOT NULL,
				name character varying(64) NOT NULL,
				open boolean NOT NULL DEFAULT true,
				CONSTRAINT todos_pkey PRIMARY KEY (id)
			)`, (error, results) => {
	if (error) {
	  throw error
	}
   return results.rows
})

const getTodos = async (state) => {
    const { rows } = await dbPool.query(`SELECT * FROM todos WHERE open = $1`, [state])

    return rows
  }

const addTodo = async (name) => {

	await dbPool.query('INSERT INTO todos (id, name, open) VALUES ($1, $2, $3)', [uuid.v4(), name, true])
}

const completeTodo = async (id) => {

	await dbPool.query('UPDATE todos SET open = false WHERE id = $1', [id])
}

module.exports = {
	getTodos,
	addTodo,
	completeTodo,
}