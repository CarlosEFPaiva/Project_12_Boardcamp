import { capitalizeFirstLetters } from "../Utils/sharedFunctions.js"

async function getCategories(connection, requiredData) {
    let id,name;
    if (requiredData) {
        id = requiredData.id;
        name = requiredData.name;
    }
    let queryText = "SELECT * FROM categories";
    const atributeValues = [];
    if (id || name) {
        queryText += " WHERE ";
        if (id) {
            queryText += "id = $1";
            atributeValues.push(id);
        }
        if (name) {
            queryText += `name iLIKE $${atributeValues.length + 1}`;
            atributeValues.push(name);
        }
    }
    queryText += ";";
    const categories = await connection.query(queryText, atributeValues);
    return categories.rows; 
}

async function isNewNameAvailable(connection, newName) {
    return (await getCategories( connection, {name:newName} )).length === 0;
}

async function insertNewCategory(connection, newName) {
    return await connection.query(`INSERT INTO categories (name) VALUES ($1);`,[capitalizeFirstLetters(newName)]);
}


export {
    getCategories,
    insertNewCategory,
}