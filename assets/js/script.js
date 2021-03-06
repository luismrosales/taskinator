var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [
  {
    id: 1,
    name: "add local storage persistance",
    type: "web",
    status: "in progress"
  },
  {
    id: 2,
    name: "web",
    status: "in progress"
  },
  {
    id: 3,
    name: "refactor code",
    type: "web",
    status: "to do"
  }
];


var completeEditTask = function(taskName, taskType, taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  alert("task updated");

  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textcontent = "Add Task";
 
  // loop through tasks array and task objects with new content
  for (var i = 0; i <tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  };
  saveTasks();
};

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }
  formEl.reset();
var isEdit = formEl.hasAttribute("data-task-id");

  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput,
    status: "to do"
  };
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  else {
    var taslDataObj = {
      name: taskNameInput,
      type: taskTypeInput
    };
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
 
  // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  // add task id as a custom attribute
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";

  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
listItemEl.appendChild(taskActionsEl);

  

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function (taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(editButtonEl);

  // create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  
 

  var statusSelectEl = document.createElement("select");

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++)
  {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

var deleteTask = function (taskId) {
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for(var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesnt match the value of taskid, lets keep that task and push into the new array
    if (tasks[i].id !==parseInt(taskId)){
      updatedTaskArr.push(tasks[i]);
    }
  }
  // reassign tasks array to be the same as updatedtaskarr
  tasks = updatedTaskArr;

  saveTasks();
};

var editTask = function (taskId) {
  console.log("editing task #" + taskId);
  // get task list item element
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  // get content from task name and type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

var taskButtonHandler = function (event) {
  

  if (event.target.matches(".delete-btn")) {
    // get the elements task id
    var taskId = event.target.getAttribute("data-task-id");
    console.log(taskId);
  }

  if (event.target.matches(".delete-btn")) {
    var taskId = event.target.getAttribute("data-task-id");
    deleteTask(taskId);
  }
  // get target element from event
  var targetEl = event.target;

  // edit button was clicked
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // delete button was clicked
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};
var taskStatusChangeHandler = function(event) {
 
//  get the task items id
var taskId = event.target.getAttribute("data-task-id");
// get the currently selected options value and convert to lowercase
var statusValue = event.target.value.toLowerCase();
// find the parent task item element based on the id
var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  // update tasks in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)){
      tasks[i].status = statusValue;
    }
  }


  saveTasks();
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
  // get task items from localstorage
  var savedTasks = localStorage.getItem("tasks");


  if (!savedTasks) {
    return false;
  }
  savedTasks = JSON.parse(savedTasks);


 

  }

    // convert tasks from the string format back into an array of objects

  // iterates through a tasks array and creates task elements on the page from it



formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();