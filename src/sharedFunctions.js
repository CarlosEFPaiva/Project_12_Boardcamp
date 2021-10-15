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

function isNewNameAvailable(newName, arrayOfItems) {
    let availability = true;
    const formmatedNewName = formatNameForComparing(newName);
    arrayOfItems.forEach( ({name:savedName}) => {
        if (formmatedNewName === formatNameForComparing(savedName)) {
            availability = false;
        }
    })
    return availability;
}

export {
    capitalizeFirstLetters,
    isNewNameAvailable,
}