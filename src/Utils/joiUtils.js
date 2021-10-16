import joi from "joi";

function areGameInputsValid(newGame) {
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(40).required(),
        image: joi.string().pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/).required(),
        stockTotal: joi.number().integer().min(1).required(),
        pricePerDay: joi.number().integer().min(1).required(),
        categoryId: joi.number().integer().min(1).required(),
    })
    return !(schema.validate(newGame)).error;
}

function isNewCategoryValid(newCategory) {
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(40).required(),
    })
    return !(schema.validate(newCategory)).error;
}

function areCustomersInputsValid({name, phone, cpf, birthday}) {
    if( !(name && phone && cpf && birthday) ) {
        return false;
    }
    const [year,month,day] = birthday.split("-");
    const monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];
    const testObject = {
        name,
        phone,
        cpf,
        year,
        month,
        day
    };
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(40).required(),
        phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
        cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
        year: joi.number().integer().min(1900).max(2016),
        month: joi.number().integer().min(1).max(12),
        day: joi.number().integer().min(1).max(monthLength[Number(month) - 1])
    });
    return !(schema.validate(testObject)).error;
}

function areRentalInputsValid(newRental) {
    const schema = joi.object({
        customerId: joi.number().integer().min(1).required(),
        gameId: joi.number().integer().min(1).required(),
        daysRented: joi.number().integer().min(1).required(),
    })
    return !(schema.validate(newRental)).error;
}



export {
    areGameInputsValid,
    isNewCategoryValid,
    areCustomersInputsValid,
    areRentalInputsValid,
}