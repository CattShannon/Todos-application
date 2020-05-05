
let elementsListToSave;

const initializeLocalStorageData = async function () {
    try {
        const response = await loadData();
        initializeNumberOfElements();
    } catch (rejected) {
        alert(`${rejected} Data has not been loaded.`)
    }
}

function loadData() {
    return new Promise((resolve, reject) => {
        try {
            elementsListToSave = localStorage.allTodoList;
            resolve("Data loaded successfully.");
        } catch (error) {
            reject("Ups! Something went wrong.");
        }
    });
}

function initializeNumberOfElements() {
    if (!localStorage.numberOfElements) {
        localStorage.setItem("numberOfElements", "0");
    }
}

initializeLocalStorageData();

const renderFromLocalStorage = async function (filter) {
    try {
        if (!thereIsDataInStorage()) {
            throw "There is nothing to render";
        }
        const response = await startRendering(filter);
        if(localStorage.filterStatus !== undefined){
            boardFooter.style.visibility = "visible";
        }
        console.log(response);
    } catch (rejected) {
        console.log(rejected);
    }
};

function startRendering(filter) {
    return new Promise((resolve, rejected) => {
        try {
            const savedDOMElements = getListOfSavedElements();
            verifyClearAllButtonVisibility(savedDOMElements);
            if (filter === undefined) {
                savedDOMElements.forEach( (element) => {
                    createDOMTodoStructure(element.id, element.checked, element.descriptionText);
                });
            }else{
                filter = Boolean(filter);
                savedDOMElements.filter( (element) => element.checked === filter)
                .forEach( (element) => {
                    createDOMTodoStructure(element.id, element.checked, element.descriptionText);
                });
            }
            resolve("render success.");
        } catch (error) {
            rejected(`Something was happened ${error}`)
        }
    });
}

function getListOfSavedElements() {
    let arrayElements = elementsListToSave.split("&");
    arrayElements = arrayElements.map((element) => JSON.parse(element));
    return arrayElements;
}

function changeFilterStatus(status){
    if(status === undefined){
        localStorage.removeItem("filterStatus");
    }else{
        localStorage.setItem("filterStatus", status);
    }
}

renderFromLocalStorage(localStorage.filterStatus);

function validateElementToSave(todoElement) {
    if (existElement(todoElement)) {
        saveInLocalStorage(todoElement);
        return true;
    }
    return false;
}

const existElement = function (todoElement) {
    return !!todoElement;
}

function saveInLocalStorage(todoElement) {
    if (thereIsDataInStorage()) {
        elementsListToSave += ("&").concat(getStringFormatOfElement(todoElement));
    } else {
        elementsListToSave = getStringFormatOfElement(todoElement);
    }
    localStorage.setItem("allTodoList", elementsListToSave);
    countNewElement();
}

function thereIsDataInStorage() {
    return elementsListToSave !== undefined && elementsListToSave !== "";
}

const getStringFormatOfElement = function (todoElement) {
    return (JSON.stringify(todoElement));
}

function countNewElement() {
    localStorage.setItem("numberOfElements",
        String(parseInt(localStorage.numberOfElements) + 1));
}

function assignNewData(savedDOMElements) {
    elementsListToSave = generateNewDataString(savedDOMElements);
    localStorage.setItem("allTodoList", elementsListToSave);
}

function generateNewDataString(savedDOMElements) {
    let newDataString = "";

    savedDOMElements
        .forEach(
            (elementToSave) => newDataString = newDataString
                .concat(`&${getStringFormatOfElement(elementToSave)}`)
        );

    newDataString = newDataString.replace("&", "");
    
    return newDataString; 
}
