import express from "express";
import cors from "cors";
import pg from "pg";

import { sendCategories, postCategories } from "./src/Categories/categoriesFunctions.js";
import { sendGames, postGames } from "./src/Games/gamesFunctions.js";
import { postCustomers, sendCustomers, updateCustomer} from "./src/Customers/customersFunctions.js";
import { sendRental, postRental } from "./src/Rentals/rentalsFunctions.js";

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

server.get("/categories", (req, resp) => sendCategories(connection, req, resp) );
server.post("/categories", (req, resp) => postCategories(connection, req, resp) );

server.get("/games", (req, resp) => sendGames(connection, req, resp));
server.post("/games", (req, resp) => postGames(connection, req, resp) );

server.get("/customers", (req, resp) => sendCustomers(connection, req, resp));
server.get("/customers/:id", (req, resp) => sendCustomers(connection, req, resp));
server.post("/customers", (req, resp) => postCustomers(connection, req, resp) );
server.put("/customers/:id", (req, resp) => updateCustomer(connection, req, resp) );

server.get("/rentals", (req, resp) => sendRental(connection, req, resp) );
server.post("/rentals", (req, resp) => postRental(connection, req, resp) );

server.listen(4000, () => {
    console.log("Server listening on port 4000")
});