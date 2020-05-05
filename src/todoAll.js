const enterTodo = document.querySelector("#enter_todo");
const boardTodos = document.querySelector("#board_todos");
const checkAll = document.querySelector("[name='markAll']");
const boardFooter = document.querySelector("[class='footer']");
const clearAll = document.querySelector("#clearAll");

function getTodoList_All() {
    return document.querySelectorAll(".checkThis");
}

function getTodoList_Completed(completed) {
    let nodeList = document.querySelectorAll(".checkThis");
    let specifiedList = [];
    for (const checkElement of nodeList) {
        if (checkElement.checked === completed) {
            specifiedList.push(checkElement); 
        }
    }
    return specifiedList;
}

enterTodo.addEventListener("keydown", createTodo);

function* idMaker(value) {
    let id = value || 0;
    while (true) {
        yield id++;
    }
}

let idGenerator = idMaker(localStorage.numberOfElements);

function createTodo(keyPressed) {
    const voidTodo = enterTodo.value === "";
    const enterKey = keyPressed.key === "Enter"
    if (enterKey && !voidTodo) {
        let id = idGenerator.next().value
        const saved = sendTLocalStorage(id, false, enterTodo.value.trim(), id);
        
        if(saved){

            createDOMTodoStructure(id, false, enterTodo.value);
            
        }else{
            alert("Error saving in storage");
        }
    }
}

function getIdInAString(stringId) {
    let numberRegex = /\d*/g;
    let match = stringId.match(numberRegex);

    return match[match.length - 2];
}

function setItemsLeftCounter() {
    let counter = document.getElementById("counter");
    counter.textContent = countItemsLeft();
    boardFooter.style.visibility = "visible";
}

function countItemsLeft() {
    const quantityItemsLeft = getTodoList_Completed(false).length;
    return `${quantityItemsLeft} ${isPlural(quantityItemsLeft) ? "items left"
        : "item left"}`;
}

function isPlural(quantity) {
    return (quantity !== 1);
}

function recieveCheckChangeEvent(event) {
    recieveTodoMark(event.target);
}

function recieveTodoMark(checkMark) {
    let checkChange = checkMark.checked;
    let checkId = checkMark.id;
    let descriptionComplete = document
        .querySelector(`#description${getIdInAString(checkId)}`);
    if (checkChange) {
        return markAsCompleted(descriptionComplete);
    }
    unmarkCompleted(descriptionComplete);
}

function markAsCompleted(description) {
    let checked = true;
    let idElement = getIdInAString(description.id);
    let dataStateChanged = changeStates(idElement, checked);
    assignNewData(dataStateChanged);

    verifyClearAllButtonVisibility(dataStateChanged);

    description.style.color = "gray";
    description.style.textDecoration = "line-through";
    setItemsLeftCounter();
}

function changeStates(idElement, checked){
    let savedDOMElements = getListOfSavedElements();
    savedDOMElements = savedDOMElements
        .map( (targetElement) => {
            if(targetElement.id === parseInt(idElement)){
                targetElement.checked = checked
            }
            return targetElement;
        });

    return savedDOMElements;
}

function verifyClearAllButtonVisibility(dataStateChanged){
    let verifyCheckedElements = dataStateChanged
        .filter( (element) => element.checked === true);

    if(verifyCheckedElements.length > 0){
        clearAll.style.visibility = "visible";
    }else{
        clearAll.style.visibility = "hidden";
    }
}

function unmarkCompleted(description) {
    let checked = false;
    let idElement = getIdInAString(description.id);
    let dataStateChanged = changeStates(idElement, checked);
    assignNewData(dataStateChanged);

    verifyClearAllButtonVisibility(dataStateChanged);

    description.style.color = "black";
    description.style.textDecoration = "none";
    setItemsLeftCounter();
}

checkAll.addEventListener("change", recieveAllMark);

function recieveAllMark() {
    const changeMark = checkAll.checked
    changeAllCompletedMark(changeMark);
}

function changeAllCompletedMark(isMarked) {
    const listOfTodos = document.querySelectorAll(".checkThis");
    for (let checkElement of listOfTodos) {
        checkElement.checked = isMarked;
        recieveTodoMark(checkElement);
    }
}

function recieveCompletedItemEvent(event) {
    clearCompleted(event.target.id);
}

function clearCompleted(completedTodoId) {
    deleteTodo(completedTodoId);
}

function deleteTodo(completedTodoId){
    const checkItemContainer = document.querySelector(`#item${completedTodoId}`);
    const todoContainer = document.querySelector(`#container${completedTodoId}`);

    checkItemContainer.remove();
    todoContainer.remove();

    let savedDOMElements = deleteFromStorage(completedTodoId);

    assignNewData(savedDOMElements);

    setItemsLeftCounter();

    verifyItemsInTodoList();
}

function deleteFromStorage(completedTodoId){
    let savedDOMElements = getListOfSavedElements();
    return (savedDOMElements = savedDOMElements
            .filter( (element) => {
                return element.id !== parseInt(completedTodoId);
            })
        );   
}

function verifyItemsInTodoList() {
    let quantityItems = getQuantityOfItems();
    if (quantityItems === 0) {
        hideFooter(boardFooter);
    }
}

function getQuantityOfItems() {
    return getTodoList_All().length;
}

function hideElement(DOMElement) {
    if(localStorage.filterStatus === undefined || elementsListToSave === ""){
        DOMElement.style.visibility = "hidden";
    }
}


clearAll.addEventListener("click", clearAllCompletedTodos);

function clearAllCompletedTodos() {
    let listOfCompleted = getTodoList_Completed(true);
    if (listOfCompleted.length > 0) {
        let idTodoClear;
        for (const todoCompleted of listOfCompleted) {
            idTodoClear = getIdInAString(todoCompleted.id);
            clearCompleted(idTodoClear);
        }
    }
}


function startEditingTodo(event) {
    let descriptionParagraph = event.target;

    const todoContainer = descriptionParagraph.parentNode;
    if (renameElementClass(todoContainer, "container_todo", "editing_todo") ){
        descriptionParagraph.style.display = "none";
            
        let descriptionText = descriptionParagraph.textContent;
        let editTodoInput = createEditingInput(descriptionText);

        todoContainer.insertAdjacentElement("afterbegin", editTodoInput);

        editTodoInput.addEventListener("blur", editingLostFocus);
        editTodoInput.addEventListener("keydown", editingKeyPressed);

        editTodoInput.focus();
    }
}

function renameElementClass(DOMElement, oldName, newName){
    try{
        const containsClass = DOMElement.classList.contains(oldName);
        if(containsClass){
            DOMElement.classList.replace(oldName, newName);
            return true;
        }else{
            throw new Error("Class name was not found in DOMElement");
        }
    }catch(error){
        console.log("Error " + error)
        throw error;
    }
}

const createEditingInput = function (descriptionText) {
    const inputToEdit = document.createElement("input");
    inputToEdit.name = "edit_todo";
    inputToEdit.type = "text";
    inputToEdit.value = descriptionText;
    inputToEdit.autofocus = true;

    return inputToEdit;
}

function editingLostFocus(event) {
    const editingInput = event.target;
    applyChanges(editingInput);
}

function editingKeyPressed(keyPressed){
    const isEscape = keyPressed.key == "Escape";
    const isEnter = keyPressed.key == "Enter";
    const editingInput = event.target;
    if(isEscape){
       return invalidateTodo(editingInput, editingInput.nextElementSibling);
    }

    if(isEnter){
        applyChanges(editingInput);
    }
}

function applyChanges(editingInput){ 
    const parentContainer = editingInput.parentNode;
    const newDescriptionText = editingInput.value.trim();
    const descriptionToChange = editingInput.nextElementSibling;
    const isRenamed = renameElementClass(parentContainer, "editing_todo", "container_todo");

    if( newTextIsValid(newDescriptionText) && isRenamed ){
        descriptionToChange.textContent = newDescriptionText;
        descriptionToChange.style.display = "block";
        resetEditingTodoInput(editingInput);
        return true
    }else{
        invalidateTodo(editingInput, descriptionToChange)
        return false;
    }
}

function newTextIsValid(newDescriptionText){
    return newDescriptionText !== ""; 
}

function resetEditingTodoInput(editingInput){
    editingInput.remove();
    editingInput = "";
}

function invalidateTodo( editingInput, descriptionToChange ){
    deleteTodo(getIdInAString(descriptionToChange.id));
    resetEditingTodoInput( editingInput );
}















