import express from "express";
import cors from "cors";
import pg from "pg";

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
    const promise = connection.query('SELECT * FROM categories')
    .then( result => {
        resp.send(result.rows);
    } )
})


server.listen(4000, () => {
    console.log("Server listening on port 4000")
});