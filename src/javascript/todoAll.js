const enterTodo = document.querySelector("#enter_todo");
const boardTodos = document.querySelector("#board_todos");
const checkAll = document.querySelector("[name='markAll']");
const boardFooter = document.querySelector("[class='footer']");
const clearAll = document.querySelector("#clearAll");

function getTodoList_All() {
    return document.querySelectorAll(".checkThis");
}

function* idMaker(value) {
    let id = value || 0;
    while (true) {
        yield id++;
    }
}

enterTodo.addEventListener("keydown", createTodo);

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

function setItemsLeftCounter() {
    let counter = document.getElementById("counter");
    counter.textContent = countItemsLeft();
    boardFooter.style.visibility = "visible";
}

function countItemsLeft() {
    let listTodoData = getListOfSavedElements();
    const quantityItemsLeft = verifyTodoStatus(listTodoData, false).length;
    return `${quantityItemsLeft} ${isPlural(quantityItemsLeft) ? "items left"
        : "item left"}`;
}

function isPlural(quantity) {
    return (quantity !== 1);
}

function getIdInAString(stringId) {
    let numberRegex = /\d*/g;
    let match = stringId.match(numberRegex);

    return match[match.length - 2];
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
    checkLocationFilter(idElement, "Active");
}


function changeStates(idElement, checked){
    let savedDOMElements = getListOfSavedElements();
    savedDOMElements = savedDOMElements
        .map( (targetElement) => {
            if(targetElement.id === parseInt(idElement)){
                targetElement.checked = checked;
            }
            return targetElement;
        });

    return savedDOMElements;
}

function verifyClearAllButtonVisibility(dataStateChanged){
    let verifyCheckedElements = verifyTodoStatus(dataStateChanged, true)

    if(verifyCheckedElements.length > 0){
        clearAll.style.visibility = "visible";
    }else{
        clearAll.style.visibility = "hidden";
    }
}

function verifyTodoStatus(listTodoState, checked){
    return listTodoState
            .filter( (element) => element.checked === checked);
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
    checkLocationFilter(idElement, "Completed");
}

checkAll.addEventListener("change", recieveAllMark);

function recieveAllMark() {
    const isChecked = checkAll.checked
    changeAllCompletedMark(isChecked);
}

function changeAllCompletedMark(isChecked) {
    const listOfTodos = document.querySelectorAll(".checkThis");
    for (let checkElement of listOfTodos) {
        checkElement.checked = isChecked;
        recieveTodoMark(checkElement);
    }
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

function recieveDeleteItemEvent(event) {
    deleteItem(event.target.id);
}

function deleteItem(todoId) {
    deleteTodo(todoId);
}

function deleteTodo(completedTodoId){
    removeTodoItem(completedTodoId);

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
        hideElement(boardFooter);
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
    let listTodoData = getListOfSavedElements();
    let listOfActive = verifyTodoStatus(listTodoData, false);
    assignNewData(listOfActive);
    reload();
}


function startEditingTodo(event) {
    let descriptionParagraph = event.target;
    const todoContainer = descriptionParagraph.parentNode;

    if ( renameElementClass(todoContainer, "container_todo", "editing_todo") ){
        changeElementDisplay(descriptionParagraph, "none");
            
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

function changeElementDisplay(DOMElement, display){
    descriptionParagraph.style.display = display;
}

const createEditingInput = function (descriptionText) {
    const inputToEdit = document.createElement("input");
    inputToEdit.name = "edit_todo";
    inputToEdit.type = "text";
    inputToEdit.value = descriptionText;

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
        changeElementDisplay(editingInput.nextElementSibling, "block");
        resetEditingTodoInput(editingInput);
        return "No changes where applied";
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

    if( textIsValid(newDescriptionText) && isRenamed ){
        descriptionToChange.textContent = newDescriptionText;
        changeElementDisplay(descriptionToChange, "none");
        resetEditingTodoInput(editingInput);
        return true;
    }else{
        return invalidateTodo(editingInput, descriptionToChange)
    }
}

function textIsValid(newDescriptionText){
    return newDescriptionText !== ""; 
}


function invalidateTodo( editingInput, descriptionToChange ){
    let todoItemId = getIdInAString(descriptionToChange.id)
    deleteTodo(todoItemId);
    resetEditingTodoInput( editingInput );
    
    return "Bad input, todo item invalidated";
}

function resetEditingTodoInput(editingInput){
    editingInput.remove();
    editingInput = "";
}















