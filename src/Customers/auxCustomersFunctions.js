async function getCustomers(connection, requiredData) {
    let id,cpf;
    if (requiredData) {
        id = requiredData.id;
        cpf = requiredData.cpf;
    }
    let queryText = `SELECT * FROM customers`;
    const atributeValues = [];
    if (id || cpf) {
        queryText += " WHERE"
        if (id) {
            queryText += " id = $1";
            atributeValues.push(id);
        }
        if (cpf) {
            queryText += ` cpf iLIKE $${atributeValues.length + 1}`;
            atributeValues.push(cpf + "%");
        }
    }
    queryText += ";"
    const customers = await connection.query(queryText, atributeValues);
    return customers.rows;
}

export {
    getCustomers,
}