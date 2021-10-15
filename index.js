import express from "express";
import cors from "cors";
import pg from "pg";

import { getCategories, postCategories } from "./src/Categories/categoriesFunctions.js";
import { postGames } from "./src/Games/gamesFunctions.js";

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

server.get("/categories", (req, resp) => getCategories(connection, resp) );

server.post("/categories", (req, resp) => postCategories(connection, req, resp) );

server.get("/games", (req, resp) => {
    connection.query("SELECT * FROM games;")
    .then( result => {
        resp.send(result.rows);
    })
})

server.post("/games", (req, resp) => postGames(connection, req, resp) )


server.listen(4000, () => {
    console.log("Server listening on port 4000")
});