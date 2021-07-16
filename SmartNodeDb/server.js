const express = require('express')
const { pool } = require('./dbConnection')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json());

app.route('/users')
    .get((req, res) => {
        pool.query(`SELECT * from users`, (err, results) => {
            if (err) throw err

            res.json(results)
        })
    })

app.route('/users/:id')
    .get((req, res) => {
        if (isNaN(req.params.id)) {
            res.json({ msg: 'Invalid number' })
            return false
        }
        pool.query(`
            SELECT * FROM users
            WHERE id = ?
        `, [req.params.id], (err, results) => {
            if (err) throw err

            if (!results.length) {
                res.json({ msg: 'no such user' })
            }
            res.json(results)
        })
    })
    .post((req, res) => {
        const { first_name, last_name, date } = req.body

        if (!checkFields(req.params.id, first_name, last_name, date)) {
            res.json({ msg: 'Invalid Fields' })
            return false
        }

        let currentAge = Math.abs(new Date(new Date().getTime() - new Date(date).getTime()).getUTCFullYear() - 1970);

        pool.query(`
            INSERT INTO users (id, first_name, last_name, age, date_of_birth) VALUES (?, ?, ?, ?, ?);
        `, [req.params.id, first_name, last_name, currentAge, date], (err, results) => {
            if (err) throw err

            res.json(results)
        })
    })
    .put((req, res) => {
        const { first_name, last_name, date } = req.body

        if (!checkFields(req.params.id, first_name, last_name, date)) {
            res.json({ msg: 'Invalid Fields' })
            return false
        }

        let currentAge = Math.abs(new Date(new Date().getTime() - new Date(date).getTime()).getUTCFullYear() - 1970);

        pool.query(`
            UPDATE users SET first_name = ?, last_name = ?, age = ?, date_of_birth = ? 
            WHERE (id = ?)
        `, [first_name, last_name, currentAge, date, req.params.id], (err, results) => {
            if (err) throw err
            if (results.affectedRows === 0) {
                res.json({ msg: 'Invalid Id' })
            }

            res.json(results)
        })
    })

const checkFields = (id, first_name, last_name, date) => {
    if (isNaN(id) || !first_name.trim().length || !last_name.trim().length || new Date(date) === "Invalid Date" || typeof first_name !== 'string' || typeof last_name !== 'string') {
        return false
    }
    return true
}

app.listen(port, () => console.log(`server running on port${port}`))