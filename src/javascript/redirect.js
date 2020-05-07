
const filter = document.querySelectorAll(".filter");

filter[0].addEventListener("click", filterTodos);
filter[1].addEventListener("click", filterTodos);
filter[2].addEventListener("click", filterTodos);

function filterTodos(event){
    let filterEvent = event.target;
    if( isTo(filterEvent, "Active") ){
        changeFilterStatus("");
        reload();                     //pregunta <- porque si no retorno
                                      //sige ejecutando el filtrado?
    }

    if( isTo(filterEvent, "Completed")){
        changeFilterStatus("completed");
        reload();
    }
    
    if( isTo(filterEvent, "All")){
        changeFilterStatus();
        reload();
    }
    
}

function isTo(filterEvent, target){
    return filterEvent.textContent === target;
}