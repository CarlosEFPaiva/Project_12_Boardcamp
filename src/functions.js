function capitalizeFirstLetter(title) {
    const lowerCaseTitle = title.toLowerCase();
    return title[0].toUpperCase() + lowerCaseTitle.substring(1);
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
    formattedName = capitalizeFirstLetter(formattedName);
    return formattedName;
}

function isNewNameAvailable(newName, arrayOfCategories) {
    let availability = true;
    const formmatedNewName = formatNameForComparing(newName);
    arrayOfCategories.forEach( ({name:savedName}) => {
        if (formmatedNewName === formatNameForComparing(savedName)) {
            availability = false;
        }
    })
    return availability;
}

export {
    capitalizeFirstLetter,
    isNewNameAvailable,
}