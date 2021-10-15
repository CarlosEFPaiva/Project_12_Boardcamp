import { isNewNameAvailable, capitalizeFirstLetters } from "../sharedFunctions.js";

async function getCategories(connection, resp) {
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        resp.send(categories.rows); 
    } catch {
        resp.sendStatus(500);
    }
    
}

async function postCategories(connection, req, resp) {
    const newName = req.body.name
    if (!newName) {
        return resp.sendStatus(400);
    }
    try {
        const categories = await connection.query("SELECT * FROM categories;")
        const savedCategories = categories.rows;
        if(!isNewNameAvailable(newName, savedCategories)) {
            return resp.sendStatus(409);
        }
        await connection.query(`INSERT INTO categories (name) VALUES ($1);`,[capitalizeFirstLetters(newName)]);
        resp.sendStatus(201);
    } catch {
        resp.sendStatus(500);
    }

}

export {
    getCategories,
    postCategories,
}