
function sendToLocalStorage(id, checked, descriptionText) {
    const elementToSave = createJSON(id, checked, descriptionText);
    return validateElementToSave(elementToSave);
}

function createJSON(...properties) {
    return {
        'id': properties[0],
        'checked': properties[1],
        'descriptionText': properties[2]
    };
}

function reload(){
    location.reload();
}

function checkLocationFilter(idElement, filterStatus){

    filterStatus = getFilterStatusCommand(filterStatus);

    if(localStorage.filterStatus === filterStatus){
        removeTodoItem(idElement);
    }
}

function getFilterStatusCommand(filterStatus){
    if(filterStatus === "Active"){
        return "";
    }else{
        return "completed";
    }
}

function removeTodoItem(elementId){
    try{
        const checkItemContainer = document.querySelector(`#item${elementId}`);
        const todoContainer = document.querySelector(`#container${elementId}`);

        checkItemContainer.remove();
        todoContainer.remove();
    }catch(error){
        alert("Error. Can't delete this item: " + error);
        throw "Error item doesn't exist";
    } 
}

function createDOMTodoStructure(generatedId, checked, textDescription) {
    
    let newTodoCheck = createNewTodoCheck(generatedId);
    let checkMark = createCheckMark(generatedId, checked);
    let checkLabel = createCheckLabel(checkMark);
    let todoContainer = createTodoContainer(generatedId);
    let todoInfo = createTodoInfo(generatedId, checked);
    let textInfo = document.createTextNode((textDescription).trim());

    todoInfo.appendChild(textInfo);
    todoContainer.appendChild(todoInfo)
    todoContainer.appendChild((createDeleteButton(generatedId)));

    newTodoCheck.appendChild(checkMark);
    newTodoCheck.appendChild(checkLabel);

    addTodoElement("#board_todos", newTodoCheck);
    addTodoElement("#board_todos", todoContainer);
    setInputValue("#enter_todo", "");

    setItemsLeftCounter();
}

function createNewTodoCheck(generatedId){
    let newTodoCheck = document.createElement("div");
    newTodoCheck.id = `item${generatedId}`;
    newTodoCheck.classList.add("check");
    newTodoCheck.title = "Mark as completed"

    return newTodoCheck;
}

function createCheckMark(generatedId, checked){
    let checkMark = document.createElement("input");
    checkMark.id = `check${generatedId}`;
    checkMark.classList.add("checkThis");
    checkMark.type = "checkbox";
    checkMark.checked = checked;
    checkMark.setAttribute("onchange", "recieveCheckChangeEvent(event)");
    
    return checkMark;
}

function createCheckLabel(checkMark){
    let checkLabel = document.createElement("label");       
    checkLabel.setAttribute("for", checkMark.id);

    return checkLabel;
}


function createTodoContainer(generatedId){
    let todoContainer = document.createElement("div")
    todoContainer.id = `container${generatedId}`;
    todoContainer.classList.add("descriptions", "container_todo");

    return todoContainer;
}


function createTodoInfo(generatedId, checked){
    let todoInfo = document.createElement("p");
    todoInfo.id = `description${generatedId}`;
    todoInfo.classList.add("description_todo");
    todoInfo.setAttribute("ondblclick", "startEditingTodo(event)")
    if(checked){
        todoInfo.style.color = "gray";
        todoInfo.style.textDecoration = "line-through";
    }else{
        todoInfo.style.color = "black";
        todoInfo.style.textDecoration = "none";
    }

    return todoInfo;
}


function createDeleteButton(generatedId) {
    let labelDelete = document.createElement("label");
    labelDelete.id = generatedId;
    labelDelete.className = "delete";
    labelDelete.setAttribute("onclick", "recieveDeleteItemEvent(event)");

    let deleteSymbol = document.createTextNode("X");
    labelDelete.appendChild(deleteSymbol);

    return labelDelete;
}

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            createJSON,
            getFilterStatusCommand,
            createNewTodoCheck,
            createCheckMark,
            createCheckLabel,
            createTodoContainer,
            createTodoInfo,
            createDeleteButton ,
            removeTodoItem          
        }
    }
}
