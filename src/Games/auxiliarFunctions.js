import { getCategories } from "../Categories/auxiliarFunctions.js";

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
            queryText += " id = $1";
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

function areRawInputsValid( name, image, stockTotal, categoryId, pricePerDay ) {
    const biggerThanZero = (value) => { return (!isNaN(Number(value)) && Number(value) > 0) }
    if ( !name || !image || !biggerThanZero(stockTotal) || !biggerThanZero(pricePerDay) || !biggerThanZero(categoryId)) {
        return false;
    }

    const URLpattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!URLpattern.test(image) && !!image.match(/\.(jpeg|jpg|gif|png)$/);
}

async function isCategoryIdValid(connection, categoryId) {
    const teste = await getCategories(connection, {id: categoryId});
    return (await getCategories(connection, {id: categoryId})).length !== 0;
}

async function areInputsValid(connection, req) {
    const {
        name,
        image,
        stockTotal,
        categoryId,
        pricePerDay
    } = req.body;

    if (!areRawInputsValid( name, image, stockTotal, categoryId, pricePerDay )) {
        console.log("AQUI!")
        return false;
    }
    if (!(await isCategoryIdValid(connection, categoryId))) {
        console.log("AQUI 2!")
        return false;
    };
    return true;
}

export {
    getGames,
    areInputsValid,
}