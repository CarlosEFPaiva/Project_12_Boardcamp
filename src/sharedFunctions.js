function capitalizeFirstLetters(title) {
    const arrayOfWords = title.split(" ");
    const capitalizedArray = arrayOfWords.map( word => {
        const lowerCaseWord = word.toLowerCase();
        return lowerCaseWord[0].toUpperCase() + lowerCaseWord.substring(1);
    })
    return capitalizedArray.join(" ");
}

function clearSpecialCharacters(title) {
    return title.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

function removeSpacesAndHyphens(name) {
    const nameWithoutSpaces = name.split(" ").join('');
    const formattedName = nameWithoutSpaces.split("-").join('')
    return formattedName;
}

function formatNameForComparing(name) {
    let formattedName = removeSpacesAndHyphens(name);
    formattedName = clearSpecialCharacters(formattedName);
    formattedName = capitalizeFirstLetters(formattedName);
    return formattedName;
}

async function isNewNameAvailable(connection, newName, getFunction) {
    return (await getFunction( connection, {name:newName} )).length === 0;
}

export {
    capitalizeFirstLetters,
    isNewNameAvailable,
}