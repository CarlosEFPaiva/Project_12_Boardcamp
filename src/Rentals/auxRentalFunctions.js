import { areRentalInputsValid } from "../Utils/joiUtils.js";
import { getCustomers } from "../Customers/auxCustomersFunctions.js";
import { getGames } from "../Games/auxGamesFunctions.js";

async function getRental(connection, {customerId, gameId}) {
    let queryText = `
    SELECT 
    rentals.*,
    customers.name AS "customerName",
    games.name AS "gameName",
    games."categoryId",
    categories.name AS "categoryName"
    FROM rentals JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id
    JOIN categories ON games."categoryId" = categories.id
    `;
    const atributeValues = [];
    if (customerId || gameId) {
        queryText += " WHERE"
        if (customerId) {
            queryText += ` "customerId" = $1`;
            atributeValues.push(customerId);
        }
        if (gameId) {
            queryText += ` "gameId" = $${atributeValues.length + 1}`;
            atributeValues.push(gameId);
        }
    }
    queryText += ";"
    const rentals = (await connection.query(queryText, atributeValues)).rows;
    const formatedRentals = rentals.map( rental => {
        return ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName
            },
            game: {
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.categoryId,
                categoryName: rental.categoryName
            }
        })
    });
    return formatedRentals;
}


async function checkInputsAndReturnRequiredGame(connection, req) {
    const {
        customerId,
        gameId
    } = req.body;
    if (!areRentalInputsValid(req.body)) {
        return false;
    };
    if (!(await getCustomers(connection, {id: customerId})).length) {
        return false;
    }
    const requiredGame = (await getGames(connection, {id: gameId}))[0];
    if (!requiredGame) {
        return false;
    }
    if (requiredGame.stockTotal <= (await getRental(connection,{gameId})).length ){
        return false;
    }
    return requiredGame ;
}

export {
    getRental,
    checkInputsAndReturnRequiredGame,
}