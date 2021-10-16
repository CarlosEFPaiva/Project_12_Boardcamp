import { areInputsValid, getGames } from "./auxGamesFunctions.js";
import { isNewAtributeAvailable, capitalizeFirstLetters} from "../Utils/sharedFunctions.js";

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

    try {
        if (!(await areInputsValid(connection, req))) {
            return resp.sendStatus(400);
        }
        if (!(await isNewAtributeAvailable(connection, "name", name, getGames))) {
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