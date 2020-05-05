
//Es necesario cargar todos los scripts?? pregunta<----
//como recargar solo una cierta parte de la pagina
//como hacer el enrutamiento #/

function sendTLocalStorage(id, checked, descriptionText) {
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

    boardTodos.appendChild(newTodoCheck);
    boardTodos.appendChild(todoContainer);
    enterTodo.value = "";

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
    checkMark.type = "checkbox";
    checkMark.id = `check${generatedId}`;
    checkMark.checked = checked;
    checkMark.classList.add("checkThis");
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
    todoInfo.setAttribute("ondblclick", "startEditingTodo(event)")
    todoInfo.classList.add("description_todo");
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
    labelDelete.setAttribute("onclick", "recieveCompletedItemEvent(event)");

    let deleteSymbol = document.createTextNode("X");
    labelDelete.appendChild(deleteSymbol);

    return labelDelete;
}
