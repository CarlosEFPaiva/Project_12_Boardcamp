import express from "express";
import cors from "cors";
import pg from "pg";

import { capitalizeFirstLetter, isNewNameAvailable } from "./src/functions.js";

const server = express();
server.use(express.json());
server.use(cors());

const { Pool } = pg;

const connection = new Pool({
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});

server.get("/categories", (req, resp) => {
    connection.query("SELECT * FROM categories;")
    .then( result => {
        resp.send(result.rows);
    })
})

server.post("/categories", (req, resp) => {
    const newName = req.body.name
    if (!newName) {
        return resp.sendStatus(400);
    }
    connection.query("SELECT * FROM categories;")
    .then( result => {
        const savedCategories = result.rows;
        if(!isNewNameAvailable(newName, savedCategories)) {
            return resp.sendStatus(409);
        }
        connection.query(`INSERT INTO categories (name) VALUES ($1);`,[capitalizeFirstLetter(newName)]);
        resp.sendStatus(201);
    })
})



server.listen(4000, () => {
    console.log("Server listening on port 4000")
});