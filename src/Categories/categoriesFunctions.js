import { getCategories, insertNewCategory } from "./auxCategoriesFucntions.js"
import { isNewAtributeAvailable } from "../Utils/sharedFunctions.js"
import { isNewCategoryValid } from "../Utils/joiUtils.js";

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
    if (!isNewCategoryValid(req.body)) {
        return resp.sendStatus(400);
    }
    try {
        if ( !(await isNewAtributeAvailable(connection, "name", newName, getCategories)) ) {
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