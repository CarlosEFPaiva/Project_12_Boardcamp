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

function getCategoryById(categoryId, arrayOfCategories) {
    return arrayOfCategories.find( ({id:savedId}) => categoryId === savedId );
}

export {
    areRawInputsValid,
    getCategoryById,
}