//modal codes

const openModalBtn =document.querySelector('#modal-btn');
const modalBox = document.querySelector('.new-todo-modal');
const darkBg = document.querySelector('.dark');
const closeModalBtn = document.querySelector('.close-btn');




function openModal(){

    darkBg.style.display = "block";
    modalBox.style.display = "block";


}

function closeModal(){

    modalBox.style.display = "none";
    darkBg.style.display = "none";
}

openModalBtn.addEventListener("click",openModal);
closeModalBtn.addEventListener("click",closeModal);
darkBg.addEventListener("click",closeModal);

//add & edit & remove Todos codes

const submitBtn = document.querySelector('.from-btn');
const todoInput = document.querySelector('#newtodo');
const selectTodo = document.querySelector("#newtodoselect");
const todoListUl = document.querySelector("#todos-ul");
const editModal = document.querySelector(".edit-todo-modal");
const closeEditModalBtn = document.querySelector(".close-edtimodal-btn");
const submitEditBtn = document.querySelector("#submitEditBtn");



function addTodo(event){

    event.preventDefault();
    const inputValue = todoInput.value;
    const selectValue = selectTodo.value;
    const newTodo = {id:Math.ceil(Math.random()*1000),value:inputValue,type:selectValue,isComputed:false};
    addToLocalStorage(newTodo);
    todoInput.value = "";
    todoInput.innerHTML = "";
    selectTodo.value = "daily";
    closeModal();
    addTodoToDom(newTodo);


   
}

function addToLocalStorage(todo){
    const todolList = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    todolList.push(todo);
    localStorage.setItem("todos",JSON.stringify(todolList));
}


function addTodoToDom(todo){

    const newLi = document.createElement("li");
    newLi.classList.add("todos-li");
    newLi.setAttribute("data-type",todo.type);
    newLi.setAttribute("data-computed",todo.isComputed);
    newLi.setAttribute("data-title",todo.value);
    const liContent = `
        <span data-title ="${todo.id}" class="todo-title ${todo.isComputed === true ? "doned-todo":""}">${todo.value}</span>
        <div class="operators">
        <i onclick="ToggleComputed(${todo.id})" data-id="${todo.id}" class="fa-solid  oparator-icons ${todo.isComputed==false ? "fa-check done-icon":"fa-rotate-left"} "></i>
        <i onclick="editTodo(${todo.id})" class="fa-solid fa-pen-to-square oparator-icons edit-icon "></i>
       <i onclick="removeTodo(${todo.id})" data-id="${todo.id}"  class="fa-solid fa-trash-can oparator-icons trash-icon "></i>
        </div>
    `;

    newLi.innerHTML = liContent;
    todoListUl.appendChild(newLi);
    
 
}

function onloadFunction(){
    const todoList = JSON.parse(localStorage.getItem("todos"));
    todoList.forEach(item => {
        addTodoToDom(item);
    });
}

function removeTodo(id){

   const todoLi =  document.querySelector(`[data-id="${id}"]`).parentElement.parentElement;
    const todoList = JSON.parse(localStorage.getItem("todos"));

    const filteredTodos = todoList.filter((todo)=>{
        return todo.id !== id;
    });

    localStorage.setItem("todos",JSON.stringify(filteredTodos));

    todoLi.remove();

}

function ToggleComputed(id){

    const todoList = JSON.parse(localStorage.getItem("todos"));

    todoList.forEach(item => {
        if(item.id === id){
          item.isComputed = !item.isComputed;
          
        }
    });

    const todoLi =  document.querySelector(`[data-id="${id}"]`).parentElement.parentElement;
    todoLi.classList.toggle("doned-todo");
    
    const operators = todoLi.childNodes[3].children;
    for(i=0;i<operators.length;i++){
        if(operators[i].classList.contains("fa-check")){
           operators[i].classList = "fa-solid  oparator-icons fa-rotate-left undoicon";
           todoLi.classList = "todos-li doned-todo";
           operators[i].parentElement.parentElement.setAttribute("data-computed","1");
         }else if(operators[i].classList.contains("fa-rotate-left")){
            operators[i].classList = "fa-solid  oparator-icons fa-check done-icon";
            todoLi.classList = "todos-li";
            operators[i].parentElement.parentElement.setAttribute("data-computed","0");
            
         }
    }
  
    localStorage.setItem("todos",JSON.stringify(todoList));
    
   

}

function openEditModal(id){

    darkBg.style.display = "block";
    editModal.style.display = "block";
    const editModalInput = document.querySelector("#edittodo");
    const todoList = JSON.parse(localStorage.getItem("todos"));
    const selectTag = document.querySelector("#edittodoselect");
    const selectOptions = selectTag.children;
    editModal.setAttribute('data-id',id);
    const editableTodo = todoList.filter((item)=>{
        return item.id == id;
    });

    const todoType = editableTodo[0].type;

    for(i=0;i<selectOptions.length;i++){

        if(selectOptions[i].value == todoType){
            selectTag.options[i].selected=true;
        }

    }

    editModalInput.value = editableTodo[0].value;
  
}

function closeEditModal(){
    darkBg.style.display = "none";
    editModal.style.display = "none";
}


function editTodo(id){

    openEditModal(id);

}

function submitEditTodo(event){
    
  event.preventDefault();
  const inputValue = document.querySelector("#edittodo").value;
  const selectTag = document.querySelector("#edittodoselect");

  const selectOptionValue = selectTag.value;
  const todoId = editModal.getAttribute('data-id');
  
  const todoList = JSON.parse(localStorage.getItem("todos"));

  const editableTodo = todoList.filter((item)=>{
     return item.id == todoId;

  });

  editableTodo[0].value = inputValue;
  editableTodo[0].type = selectOptionValue;

  localStorage.setItem("todos",JSON.stringify(todoList));
  const todoTitle =  document.querySelector(`[data-title="${todoId}"]`);
  todoTitle.innerHTML = inputValue;
  todoTitle.parentElement.setAttribute('data-type',selectOptionValue);
 




  closeEditModal();


}


submitBtn.addEventListener("click",addTodo);
window.addEventListener('load',onloadFunction);
closeEditModalBtn.addEventListener('click',closeEditModal);
darkBg.addEventListener("click",closeEditModal);
submitEditBtn.addEventListener("click",submitEditTodo);


//filter and search

const searchInput = document.querySelector("#search-input");
const searchSelectOption = document.querySelector("#serach-select");

function searchWithInput(event){
    
    searchSelectOption.value = "all";
    const AllLi =  todoListUl.children;
    const filteredTodos = [];
    for(i=0;i<AllLi.length;i++){
      if(AllLi[i].getAttribute('data-title').includes(event.target.value)){
          filteredTodos.push(AllLi[i]);
      }
    }

    
    if(!filteredTodos){
       for(i=0;i<AllLi.length;i++){
            AllLi[i].style.display = "flex";
       }
    }else{
        for(i=0;i<AllLi.length;i++){
            AllLi[i].style.display = "none";
       }
       for(i=0;i<filteredTodos.length;i++){
           filteredTodos[i].style.display = "flex";
       }
    }

   
    

}


function searchWithSelect(event){
    searchInput.value = "";
    const AllLi =  todoListUl.children;
    switch(event.target.value){
        case "all" : 
            for(i=0;i<AllLi.length;i++){
               AllLi[i].style.display = "flex";
            }
          break;
         case "monthly" :
            
            for(i=0;i<AllLi.length;i++){
                if(AllLi[i].getAttribute("data-type")=="monthly"){
                   AllLi[i].style.display = "flex";
                }else{
                    AllLi[i].style.display = "none";
                }
               
            }
             break;
         case "weekly" : 
        
         for(i=0;i<AllLi.length;i++){
             if(AllLi[i].getAttribute("data-type")=="weekly"){
                AllLi[i].style.display = "flex";
             }else{
                AllLi[i].style.display = "none";
             }
             
         }
             break;
         case "daily" : 
        
         for(i=0;i<AllLi.length;i++){
             if(AllLi[i].getAttribute("data-type")=="daily"){
                AllLi[i].style.display = "flex";
             }else{
                AllLi[i].style.display = "none";
             }
             
         }
             break;
        
       
     }

  
}

searchInput.addEventListener("input",searchWithInput);
searchSelectOption.addEventListener("change",searchWithSelect);

