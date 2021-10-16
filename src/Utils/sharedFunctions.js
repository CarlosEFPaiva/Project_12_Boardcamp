function capitalizeFirstLetters(title) {
    const arrayOfWords = title.split(" ");
    const capitalizedArray = arrayOfWords.map( word => {
        const lowerCaseWord = word.toLowerCase();
        return lowerCaseWord[0].toUpperCase() + lowerCaseWord.substring(1);
    })
    return capitalizedArray.join(" ");
}

async function isNewAtributeAvailable(connection, atributeName, atributeValue, getFunction) {
    return (await getFunction( connection, Object.fromEntries([[atributeName,atributeValue]]) )).length === 0;
}

export {
    capitalizeFirstLetters,
    isNewAtributeAvailable,
}