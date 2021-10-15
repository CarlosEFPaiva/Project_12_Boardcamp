import { capitalizeFirstLetters } from "../sharedFunctions.js"

async function getCategories(connection, requiredId) {
    let queryText = "SELECT * FROM categories";
    const atributeValues = []
    if (requiredId) {
        queryText += " WHERE id = $1";
        atributeValues.push(requiredId);
    }
    queryText += ";";
    const categories = await connection.query(queryText, atributeValues);
    return categories.rows; 
}

async function isNewNameAvailable(connection, newName) {
    return (await getCategories( connection, {name:capitalizeFirstLetters(newName)} )).length === 0;
}

async function insertNewCategory(connection, newName) {
    return await connection.query(`INSERT INTO categories (name) VALUES ($1);`,[capitalizeFirstLetters(newName)]);
}


export {
    getCategories,
    isNewNameAvailable,
    insertNewCategory,
}