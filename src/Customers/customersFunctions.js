import { areCustomersInputsValid } from "../Utils/joiUtils.js";
import { isNewAtributeAvailable, capitalizeFirstLetters} from "../Utils/sharedFunctions.js";
import { getCustomers } from "./auxCustomersFunctions.js";

async function sendCustomers(connection, req, resp) {
    const requiredId = req.params.id;
    const requiredCpf = req.query.cpf;
    try {
        if (!requiredId) {
            return resp.send(await getCustomers(connection, {cpf: requiredCpf}));
        }
        const customersById = await getCustomers(connection, {id: requiredId});
        if (customersById.length === 0) {
            return resp.sendStatus(404);
        }
        return resp.send(customersById[0]);
    } catch (error) {
        console.log(error);
        resp.sendStatus(500);
    }
 }

 async function postCustomers(connection, req, resp) {
    const {
        name,
        phone,
        cpf,
        birthday
    } = req.body;

    try {
        if (!areCustomersInputsValid(req.body) ) {
            return resp.sendStatus(400);
        }
        if (!(await isNewAtributeAvailable(connection, "cpf", cpf, getCustomers))) {
            return resp.sendStatus(409);
        };
        await connection.query(`INSERT INTO customers ("name", "phone", "cpf", "birthday")` +
        ` VALUES ($1, $2, $3, $4);`,[capitalizeFirstLetters(name), phone, cpf, birthday])
        resp.sendStatus(201);
    } catch (error) {
        console.log(error)
        resp.sendStatus(500)
    }
}

 export {
     sendCustomers,
     postCustomers,
 }