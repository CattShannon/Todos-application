const getElement = (elementQuery) => {
    return document.querySelector(elementQuery);
}

function getAllElementsBy(elementsQuery){
    return document.querySelectorAll(elementsQuery);
}

function getElementInputValue(element){
    return element.value.trim();
}

function getInputValue(inputQuery){
    return document.querySelector(inputQuery).value.trim();
}

function setInputValue(inputElement, value){
    inputElement.value = value.trim();
}

function getCheckedValue(checkQuery){
    return document.querySelector(checkQuery).checked;
}

function setCheckedValue(checkQuery, check){
    document.querySelector(checkQuery).checked = check;
}

function setElementVisibility(elementQuery, visibility){
    document.querySelector(elementQuery).style.visibility = visibility;
}

function cleanDomElement(elementQuery){
    document.querySelector(elementQuery).innerHTML = '';
}

function addTodoElement(elementQuery, todo){
    document.querySelector(elementQuery).appendChild(todo);
}

function getParentNode(element){
    return element.parentNode;
}

function getSiblingNode(element){
    return element.nextElementSibling;
}

function getElementTextContent(element){
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

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            getElement,
            getAllElementsBy,
            getInputValue,
            setInputValue,
            getCheckedValue,
            setCheckedValue,
            setElementVisibility,
            cleanDomElement,
            addTodoElement,
            getParentNode,
            getSiblingNode,
            getElementInputValue,
            getElementTextContent,
            setElementTextContent,
            setElementDisplay,
            checkIfContainsClass,
            replaceClassName,
            insertHTMLElement
        }
    }
}
