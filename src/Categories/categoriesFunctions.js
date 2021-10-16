import { getCategories, insertNewCategory } from "./auxiliarFunctions.js"
import { isNewNameAvailable } from "../sharedFunctions.js"

async function sendCategories(connection, req, resp) {
    try {
        resp.send(await getCategories(connection));
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
}

async function postCategories(connection, req, resp) {
    const newName = req.body.name;
    if (!newName) {
        return resp.sendStatus(400);
    }
    try {
        if ( !(await isNewNameAvailable(connection, newName, getCategories)) ) {
            return resp.sendStatus(409);
        }
        await insertNewCategory(connection, newName);
        resp.sendStatus(201);
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }

}

export {
    sendCategories,
    postCategories,
}