const getElement = (inputQuery) => {
    return document.querySelector(inputQuery);
}

function getAllElementsBy(inputQuery){
    return document.querySelectorAll(inputQuery);
}

function getInputValue(inputQuery){
    return document.querySelector(inputQuery).value.trim();
}

function setInputValue(element, value){
    element.value = value.trim();
}

function getCheckedValue(inputQuery){
    return document.querySelector(inputQuery).checked;
}

function setCheckedValue(inputQuery, check){
    document.querySelector(inputQuery).checked = check;
}

function setElementVisibility(inputQuery, visibility){
    document.querySelector(inputQuery).style.visibility = visibility;
}

function cleanDomElement(inputQuery){
    document.querySelector(inputQuery).innerHTML = '';
}

function addTodoElement(inputQuery, todo){
    document.querySelector(inputQuery).appendChild(todo);
}

function getParentNode(element){
    return element.parentNode;
}

function getSiblingNode(element){
    return element.nextElementSibling;
}

function getElementInputValue(element){
    return element.value.trim();
}

function getElementTextContent(element, newTextContent){
    return element.textContent;
}

function setElementTextContent(element, newTextContent){
    element.textContent = newTextContent;
}

function setElementDisplay(element, display){
    element.style.display = display
}

function checkIfContainsClass(element, className){
    return element.classList.contains(className);
}

function replaceClassName(element, oldName, newName){
    element.classList.replace(oldName, newName)
}

function insertHTMLElement(element, position, elementToInsert){
    element.insertAdjacentElement(position, elementToInsert);
}