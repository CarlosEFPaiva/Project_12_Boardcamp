import { areRentalInputsValid } from "../Utils/joiUtils.js";
import { getCustomers } from "../Customers/auxCustomersFunctions.js";
import { getGames } from "../Games/auxGamesFunctions.js";

async function getRental(connection, {rentalId, customerId, gameId}) {
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
    if (rentalId || customerId || gameId) {
        queryText += " WHERE"
        if (rentalId) {
            queryText += ` rentals."id" = $1`;
            atributeValues.push(rentalId);
        }
        if (customerId) {
            queryText += ` "customerId" = $${atributeValues.length + 1}`;
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

async function setReturnDateAndDelayFee(connection, requiredRental) {
    const todaysDate = new Date();
    const rentDate = new Date(requiredRental.rentDate);
    const actualRentedDays = Math.abs(todaysDate.setHours(0,0,0,0) - rentDate) / (1000*3600*24) ;
    const delayDays = actualRentedDays > requiredRental.daysRented ? actualRentedDays - requiredRental.daysRented : 0;
    const pricePerDay = requiredRental.originalPrice / requiredRental.daysRented;
    const delayFee = delayDays * pricePerDay;

    await connection.query(`
    UPDATE rentals 
    SET
        "returnDate" = $1,
        "delayFee" = $2
    WHERE
        id = $3;
        `,
        [
            `${todaysDate.getFullYear()}-${todaysDate.getMonth() + 1}-${todaysDate.getDate()}`,
            delayFee,
            requiredRental.id
        ]);
}

export {
    getRental,
    checkInputsAndReturnRequiredGame,
    setReturnDateAndDelayFee,
}