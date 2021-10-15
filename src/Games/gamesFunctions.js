import { areRawInputsValid, getGames } from "./auxiliarFunctions.js";
import { isNewNameAvailable, capitalizeFirstLetters} from "../sharedFunctions.js";

async function sendGames(connection, req, resp) {
   const requiredName = req.query.name;
    try {
        resp.send(await getGames(connection, {name: requiredName}));
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
}

async function postGames(connection, req, resp) {
    const {
        name,
        image,
        stockTotal,
        categoryId,
        pricePerDay
    } = req.body;

    if (!areRawInputsValid( name, image, stockTotal, categoryId, pricePerDay )) {
        return resp.sendStatus(400);
    }
    try {
        const categories = await connection.query("SELECT * FROM categories;");
        const savedCategories = categories.rows;
        const categoryName = getCategoryById(categoryId, savedCategories);
        if (!categoryName) {
            return resp.sendStatus(400);
        };
        const games = await connection.query("SELECT * FROM games;");
        const savedGames = games.rows;
        if (!isNewNameAvailable(name, savedGames)) {
            return resp.sendStatus(409);
        };
        await connection.query(`INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay")` +
        ` VALUES ($1, $2, $3, $4, $5);`,[capitalizeFirstLetters(name), image, stockTotal, categoryId, pricePerDay])
        resp.sendStatus(201);
    } catch {
        resp.sendStatus(500)
    }
}

export {
    sendGames,
    postGames,
}