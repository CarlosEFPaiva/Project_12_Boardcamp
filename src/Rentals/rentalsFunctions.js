import { getRental, checkInputsAndReturnRequiredGame, setReturnDateAndDelayFee } from "./auxRentalFunctions.js";

async function sendRental(connection, req, resp) {
    const {
        customerId,
        gameId
    } = req.query;
    try {
        resp.send(await getRental(connection, {customerId, gameId}));
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
}


async function postRental(connection, req, resp) {
    const {
        customerId,
        gameId,
        daysRented
    } = req.body;
    try {
        const requiredGame = (await checkInputsAndReturnRequiredGame(connection, req));
        if(!requiredGame) {
            return resp.sendStatus(400);
        }
        const today = new Date();
        await connection.query(`
        INSERT INTO rentals 
            (
                "customerId",
                "gameId",
                "rentDate",
                "daysRented",
                "returnDate",
                "originalPrice",
                "delayFee"
            )
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7);
        `,[
            customerId, 
            gameId,
            `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            daysRented,
            null,
            requiredGame.pricePerDay * daysRented,
            null
        ])
        resp.sendStatus(201); 
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
}

async function endRental(connection, req, resp) {
    const rentalId = req.params.id;
    try {
        const requiredRental = (await getRental(connection, {rentalId}))[0];
        if (!requiredRental) {
            return resp.sendStatus(404);
        }
        if (!!requiredRental.returnDate){
            return resp.sendStatus(400);
        }
        await setReturnDateAndDelayFee(connection, requiredRental);
        resp.sendStatus(200);
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
}

export {
    sendRental,
    postRental,
    endRental,
}