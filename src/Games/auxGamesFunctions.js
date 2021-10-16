import { getCategories } from "../Categories/auxCategoriesFucntions.js";
import { areGameInputsValid } from "../Utils/joiUtils.js";

async function getGames(connection, requiredData) {
    let id,name;
    if (requiredData) {
        id = requiredData.id;
        name = requiredData.name;
    }
    let queryText = `
    SELECT 
    games.*,
    categories.name AS "categoryName" 
    FROM games JOIN categories ON games."categoryId" = categories.id`;
    const atributeValues = [];
    if (id || name) {
        queryText += " WHERE"
        if (id) {
            queryText += " games.id = $1";
            atributeValues.push(id);
        }
        if (name) {
            queryText += ` games.name iLIKE $${atributeValues.length + 1}`;
            atributeValues.push(name + "%");
        }
    }
    queryText += ";"
    const games = await connection.query(queryText, atributeValues);
    return games.rows;
}

async function isCategoryIdValid(connection, categoryId) {
    const teste = await getCategories(connection, {id: categoryId});
    return (await getCategories(connection, {id: categoryId})).length !== 0;
}

async function areInputsValid(connection, req) {
    if (!areGameInputsValid(req.body)) {
        return false;
    }
    if (!(await isCategoryIdValid(connection, req.body.categoryId))) {
        return false;
    };
    return true;
}

export {
    getGames,
    areInputsValid,
}