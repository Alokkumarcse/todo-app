let form = document.getElementById('form')
  taskInput = document.getElementById('taskInput'),
  dateInput = document.getElementById('dateInput'),
  textarea = document.getElementById('textarea'),
  dangerMsg = document.getElementById('dangerMsg'),
  tasks = document.getElementById('tasks'),
  add = document.getElementById('add');



// tips: use console to test what we do is correct or not, 

// ! handle form submittion event...
form.addEventListener('submit', (e) => {
  //preventing default refresh when submit the form each time
  e.preventDefault();
  //invoke formvalidation() method to validate our form data
  formValidation();
});

// ! Here validating our form data...
let formValidation = () => {
  // if data is not given and submit than show error message otherwise process form data
  if(taskInput.value === ""){
    console.log('fail');
    dangerMsg.innerHTML = "Task can not be blank";
  }else{
    console.log("success");
    dangerMsg.innerHTML = "";
    //form data is correct so here invoke acceptData() to store data
    acceptData();
    // ! adding behaviour to close form itself when click on add button only once.
    //need two clicks on (Add) button to close form after given data,
    //so how to close form in one click on (Add) button ???

    //on successful form validation, we set (Close) button attribute (data-bs-dismiss="modal") into (Add) button, so
    //when click on (Add) button then form templet closed.(Add) button behave like (close) button.
    add.setAttribute("data-bs-dismiss", "modal");
    //click on (Add) button they close the form templet.
    add.click();
    // here use IIFE to prevent the blank form closing when click on (Add) button
    // via setting attribute value is null ("data-bs-dismiss", "").
    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
}

// ! Now accept and store the data into (local storeage) to make data persistance.
let dataStore = [];

let acceptData = () => {
  // console.log('task', taskInput.value);
  // console.log('date', dateInput.value);
  // console.log('descritpion', textarea.value);
  dataStore.push({
    "task" : taskInput.value,
    "date": dateInput.value,
    "description": textarea.value,
  });
  // console.log(dataStore); 

  // store array data[] into localStorage web api method
  localStorage.setItem('dataStore', JSON.stringify(dataStore));
  //invoke createTask() to crate task-card and show on screen
  createTasks();
} 

// ! create post card and fill all collected data into post card
let createTasks = () => {
  // create new task-card and append into task list
  //here using (templet literals) to create task-card and 
  //change the of string where need to add new data via ${expression} js syntax
  tasks.innerHTML = "";
  dataStore.map((dataObj,  index) => {
    return (
      tasks.innerHTML += `
      <div id=${index} >
          <span class="fw-bold">${dataObj.task}</span>
          <span class="small text-secondary">Due Date: ${dataObj.date} </span>
          <p>${dataObj.description} </p>
          <span class="options">
            <i onClick="editTask(this)" class="fa-regular fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#form"></i>
            <i onClick="deleteTask(this)" class="fa-solid fa-trash"></i>
          </span>
      </div>`
    );
  });
  // invoke resetForm() method
  resetForm();
}

// ! Reset form data to take new data again
let resetForm = () => {
  taskInput.value ="";
  dateInput.value ="";
  textarea.value ="";
}

// ! Delete the Task
let deleteTask = (task) => {
  //removing the task-card form dom
  task.parentElement.parentElement.remove();
  //removing task form dataStore also.
  dataStore.splice(task.parentElement.parentElement.id, 1);
  //updating the dataStore in loacalStorage to keep update dataStore.
  localStorage.setItem('dataStore', JSON.stringify(dataStore));
}

//  ! Edit task
// click on edit icon need to form pops up with previous data
let editTask = (task) => {
  //get the task-card's parent
  let parent = task.parentElement.parentElement;
  //get back previous data from each data container child
  taskInput.value = parent.children[0].innerHTML;
  dateInput.value = parent.children[1].innerHTML;
  textarea.value = parent.children[2].innerHTML;
  //Removing old task-card from task list
  deleteTask(task);
}

// ! get back all updated data into data[] from localStorage when page refresh or load first time, use IIFE
(() => {
  //when first part is null than empty array stroe in dataStore.
  dataStore =JSON.parse(localStorage.getItem('dataStore')) || [];
  console.log(dataStore);
  //crateTasks() is invoke here to create task-card for all data get when browser refresh or loaded first time.
  createTasks();
})();