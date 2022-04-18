let taskTemp = document.querySelector(".taskTemp");
let completeTaskCont = document.querySelector(".CompletedTaskContainer");
let taskContainer = document.querySelector(".taskContainer");
$(".add-task").click(handleAddTask);
let resources = [];

function handleAddTask(){
    let date = prompt("Enter the date");
    if(date==null || date=="") {
        alert("Please Enter the Date");
        return;
    }
    let taskName = prompt("Enter the task");
    if(taskName==null || taskName=="") {
        alert("Please Enter the task");
        return;
    }
    let taskid;
    if(resources.length==0) taskid = 0;
    else taskid = resources[resources.length-1].taskid;
    taskid++;
    let completed = false;
    addTaskIntoHTML(date,taskName,taskid,completed);
    resources.push({
        taskid: taskid,
        taskName: taskName,
        date: date,
        completed:completed
    });
    saveToStorage();
}

function addTaskIntoHTML(date,taskName,taskid,completed){
    let taskTemplate = taskTemp.content.querySelector(".taskBody");
    let task = document.importNode(taskTemplate,true);
    let taskDesc = task.querySelector(".taskDesc");
    let taskDate = task.querySelector(".date");
    let taskStatus = task.querySelector(".taskStatus");
    let taskCheck = task.querySelector(".check");
    let deleteBtn = task.querySelector(".delete");
    taskDesc.innerHTML = taskName;
    taskDate.innerHTML = date;
    task.setAttribute("taskid",taskid);
    if(completed==true){
     taskStatus.innerHTML = "Completed";
     setTimeout(() => {  
         taskCheck.click();
     }, 1000);
     completeTaskCont.append(task);
    }
        
    else if(completed==false) taskContainer.append(task);
    
    taskCheck.addEventListener("click",handleCheck);
    deleteBtn.addEventListener("click",handleDelete);
}



function handleDelete(){
    let tid = Number(this.parentNode.parentNode.getAttribute("taskid"));
    this.parentNode.parentNode.remove();
    let taskIdIdx = resources.findIndex(f=>f.taskid == tid);
    resources.splice(taskIdIdx,1);
    saveToStorage();

}

function handleCheck() {
    let task = this.parentNode;
    let taskId = Number(task.getAttribute("taskid"));
    let taskStatus = task.querySelector(".taskStatus");
    let isChecked = this.getAttribute("isChecked");
    if(isChecked=="false"){
        task.setAttribute("completed","true");
        taskStatus.innerText = "Completed";
        this.setAttribute("isChecked","true");
        completeTaskCont.append(task);
        task.style.backgroundColor = "#b33939"
        let resource = resources.find(f=>f.taskid == taskId);
        resource.completed = true;
        saveToStorage();
    }else{
        taskStatus.innerText = "Not Completed";
        this.setAttribute("isChecked","false");
        taskContainer.append(task);
        task.setAttribute("completed","false");
        task.style.backgroundColor = "#2d3436";
        let resource = resources.find(f=>f.taskid == taskId);
        resource.completed = false;
        saveToStorage();
    }
    
}

function saveToStorage() {
    localStorage.setItem("taskManager",JSON.stringify(resources));
}
function loadFromLocalStorage(){
    let data = localStorage.getItem("taskManager");
    if(!data) return;
    resources = JSON.parse(data);
    for(let i=0;i<resources.length;i++){
        addTaskIntoHTML(resources[i].date,resources[i].taskName,resources[i].taskid,resources[i].completed);
        console.log(resources[i].taskName);
    }
}

loadFromLocalStorage();