
function getTodoList_All() {
    return getAllElementsBy(".checkThis");
}

function createTodo(keyPressed) {
    const todoValue = getInputValue("#enter_todo");
    const voidTodo = todoValue === "";
    const enterKey = keyPressed.key === "Enter"
    if (enterKey && !voidTodo) {

        let id = idGenerator.next().value
        const saved = sendToLocalStorage(id, false, todoValue.trim());
        
        if(saved){

            createDOMTodoStructure(id, false, todoValue);
            
        }else{
            alert("Error saving in storage");
        }
    }
}

function setItemsLeftCounter() {
    let counter = getElement("#counter");
    counter.textContent = countItemsLeft();
    setElementVisibility(".footer", "visible");
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
        setElementVisibility("#clearAll", "visible");
    }else{
        setElementVisibility("#clearAll", "hidden");
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



function recieveAllMark() {
    const isChecked = getCheckedValue("[name='markAll']");
    changeAllCompletedMark(isChecked);
}

function changeAllCompletedMark(isChecked) {
    const listOfTodos = getAllElementsBy(".checkThis");
    for (let checkElement of listOfTodos) {
        let queryElementId = `#${checkElement.id}`;
        setCheckedValue(queryElementId, isChecked);
        recieveTodoMark(checkElement);
    }
}

function recieveCheckChangeEvent(event) {
    recieveTodoMark(event.target);
}

function recieveTodoMark(checkMark) {
    let checkId = checkMark.id;
    let checkChange = getCheckedValue(`#${checkId}`);
    
    let descriptionComplete = (
        getElement(`#description${getIdInAString(checkId)}`)
    );

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

function verifyItemsInTodoList() {
    let quantityItems = getQuantityOfItems();
    const boardFooter = getElement(".footer");
    if (quantityItems === 0) {
        hideElement(boardFooter);
    }
}

function getQuantityOfItems() {
    return getTodoList_All().length;
}

function clearAllCompletedTodos() {
    let listTodoData = getListOfSavedElements();
    let listOfActive = verifyTodoStatus(listTodoData, false);
    assignNewData(listOfActive);
    reload();
}


function startEditingTodo(event) {
    let descriptionParagraph = event.target;
    const todoContainer = getParentNode(descriptionParagraph);

    if ( renameElementClass(todoContainer, "container_todo", "editing_todo") ){
        setElementDisplay(descriptionParagraph, "none");
            
        let descriptionText = getElementTextContent(descriptionParagraph);
        let editTodoInput = createEditingInput(descriptionText);

        insertHTMLElement(todoContainer, "afterbegin", editTodoInput);

        innerListenner(editTodoInput, "keydown", editingKeyPressed)
        //innerListenner(editTodoInput, "blur", editingLostFocus);
        
        editTodoInput.focus();
    }
}

function renameElementClass(DOMElement, oldName, newName){
    try{
        const containsClass = checkIfContainsClass(DOMElement, oldName);
        if(containsClass){
            replaceClassName(DOMElement, oldName, newName);
            return true;
        }else{
            throw new Error("Class name was not found in DOMElement.");
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
    setInputValue(inputToEdit, descriptionText);

    return inputToEdit;
}

function editingKeyPressed(keyPressed){
    const isEscape = keyPressed.key == "Escape";
    const isEnter = keyPressed.key == "Enter";
    const editingInput = event.target;
    const descriptionToChange = getSiblingNode(editingInput);

    if(isEscape){
        setElementDisplay(descriptionToChange, "block");
        resetEditingTodoInput(editingInput);
        return "No changes where applied";
    }

    if(isEnter){

        applyChanges(editingInput, descriptionToChange);

    }
}

/* function editingLostFocus(event) {
    //debugger
    if(event.type !== "KeyboardEvent"){
        const editingInput = event.target;
        applyChanges(editingInput);
    }
} */

function applyChanges(editingInput, descriptionToChange){ 
    const parentContainer = getParentNode(editingInput);
    const newDescriptionText = getElementInputValue(editingInput);
    const idTodoItem = getIdInAString(descriptionToChange.id);
    const isRenamed = renameElementClass(parentContainer, "editing_todo", "container_todo");

    if( textIsValid(newDescriptionText) && isRenamed ){
        setElementTextContent(descriptionToChange, newDescriptionText)
        setElementDisplay(descriptionToChange, "block");
        resetEditingTodoInput(editingInput);

        let newChanges = changeText(idTodoItem, newDescriptionText);
        assignNewData( newChanges );
        return true;
    }else{
        return invalidateTodo(editingInput, descriptionToChange)
    }
}

function textIsValid(newDescriptionText){
    return newDescriptionText !== ""; 
}

function changeText(idElement, newDescriptionText){
    let savedDOMElements = getListOfSavedElements();
    savedDOMElements = savedDOMElements
        .map( (targetElement) => {
            if(targetElement.id === parseInt(idElement)){
                targetElement.descriptionText = newDescriptionText;
            }
            return targetElement;
        });

    return savedDOMElements;
}

function invalidateTodo( editingInput, descriptionToChange ){
    let todoItemId = getIdInAString(descriptionToChange.id)
    resetEditingTodoInput( editingInput );
    deleteTodo(todoItemId);
    
    return "Bad input, todo item invalidated";
}

function resetEditingTodoInput(editingInput){
    editingInput.remove();
    editingInput = "";
}















