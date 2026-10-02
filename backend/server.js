// Expense Tracker - backend (Express API + PostgreSQL)
//
// PHASE 1
// Setup:
//   1. Create a database named expense_tracker and run schema.sql on it.
//   2. Copy .env.example to a new file named .env and write your PostgreSQL password.
//   3. npm install express cors pg dotenv
// Run:    node server.js   (restart it every time you change this file)
//
// Endpoints you need to build:
//   GET    /api/expenses        return all expenses
//   GET    /api/expenses/:id    return one expense (404 if not found)
//   POST   /api/expenses        add an expense (201, or 400 if the data is invalid)
//   PUT    /api/expenses/:id    update an expense (200, 400, or 404)
//   DELETE /api/expenses/:id    delete an expense (200, or 404)
//
// Tips:
//   - Create one Pool (from the "pg" library) with the values from .env,
//     and use pool.query(...) in every route.
//   - ALWAYS send the values as parameters: pool.query("... WHERE id = $1", [id]).
//     NEVER build the SQL text by joining strings with data from the user.
//   - Use RETURNING to get the new (or updated) row back from INSERT and UPDATE.
//   - The database creates the id. The client never sends one.
//   - pg returns NUMERIC as text and DATE as a JavaScript Date, so fix both in your SELECT.
//     Hint: amount::float8 and to_char(date, 'YYYY-MM-DD').
//   - Validate the data before the query, and answer 400 with a message that explains the problem.
//   - Check the id before the query. A text like "abc" makes PostgreSQL throw an error.
//   - Enable CORS so the frontend can talk to the server.
//   - Test every endpoint with Thunder Client BEFORE you connect the frontend.


const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const port = 3000;
require("dotenv").config();
const app = express();

app.use(express.json()); // for post,put method to read json format
app.use(cors());

const pool = new Pool({

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME


});




app.get("/api/expenses", async (req, res) => {


    try {

        const result = await pool.query(`SELECT id,title,
                amount::float8,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses`);

        res.status(200).json(result.rows);

    }
    catch (error) {
        console.log(error);
        res.status(500).json({

            message: "Internal server error"
        });
    }


});




app.get("/api/expenses/:id", async (req, res) => {


    try {

        const id = Number(req.params.id);

        if (!validateId(id)) {

            return res.status(404).json({ message: "Invalid Expense ID" });
        }


        const result = await pool.query(`SELECT id,title,
                amount::float8,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses WHERE id=$1`, [id]);


        if (result.rows.length == 0) {
            return res.status(404).json({ message: "Expense Not Found" });
        }

        res.status(200).json(result.rows[0]);

    }

    catch (error) {
        console.log(error);
        res.status(500).json({

            message: "Internal server error"
        });
    }





});






app.post("/api/expenses", async (req, res) => {

    try {

        const { title, amount, category, date } = req.body;

        const validateData = validateExpense(title, amount, category, date);

        if (validateData != null) {
            return res.status(400).json({
                message: validateData
            });
        }




        const result = await pool.query(`INSERT INTO expenses(title, amount, category, date) 
        VALUES($1, $2, $3, $4) RETURNING
        id,
        title,
        amount::float8,
        category,
        to_char(date, 'YYYY-MM-DD') AS date`,
            [title.trim(), Number(amount), category, date]
        );

        res.status(201).json(result.rows[0]);
    }

    catch (error) {

        console.log(error);
        res.status(500).json(
            { message: "Internal server error" }
        );


    }




});





app.put("/api/expenses/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!validateId(id)) {

            return res.status(404).json({ message: "Invalid Expense ID" });
        }


        const { title, amount, category, date } = req.body;

        const validateData = validateExpense(title, amount, category, date);

        if (validateData != null) {
            return res.status(400).json({
                message: validateData
            });
        }

        const result = await pool.query(`UPDATE expenses 
            SET title=$2,amount=$3,category=$4,date=$5 WHERE id=$1 
            RETURNING
                 id,
                 title,
                 amount::float8 AS amount,
                 category,
                 to_char(date, 'YYYY-MM-DD') AS date`,
            [id, title.trim(), Number(amount), category, date]
        );


        if (result.rows.length == 0) {
            return res.status(404).json({
                message: "Expense Not Found"
            });
        }

        res.status(200).json(result.rows[0]);


    }
    catch (error) {

        console.log(error);

        res.status(500).json({ message: "Internal server error" });

    }





});


app.delete("/api/expenses/:id", async (req, res) => {

    try {


        const id = Number(req.params.id);

        if (!validateId(id)) {

            return res.status(404).json({ message: "Invalid Expense ID" });
        }

        const result = await pool.query(`DELETE FROM expenses WHERE id=$1 RETURNING id`, [id]);

        if (result.rows.length == 0) {

            return res.status(404).json({ message: "Expense Not Found" })
        }

        res.status(200).json({ message: "Expense Deleted Successfully" })


    }


    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }






});





function validateId(id) {
    return Number.isInteger(id) && id > 0;
}

function validateExpense(title, amount, category, date) {

    const categories = [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Other"
    ];

    if (typeof title !== "string" || title.trim() == "") {
        return "Title is required";
    }

    if (amount == undefined || amount == null || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
        return "Amount must be a number greater than Zero";
    }

    if (!categories.includes(category)) {
        return "Invalid category";
    }

    if (
        typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date) {

        return "Invalid date";
    }

    return null;  // No error all data true.
}


app.listen(port, () => {

    console.log("The Server Listen");
});



