const enterTodo = () => getElement("#enter_todo");
const checkAll =  () => getElement("[name='markAll']");
const clearAll =  () => getElement("#clearAll");;

enterTodo().addEventListener("keydown", createTodo);
checkAll().addEventListener("change", recieveAllMark);
clearAll().addEventListener("click", clearAllCompletedTodos);

function innerListenner(element, type, callback){
    element.addEventListener(type, callback);
}