let addTaskBtn = document.querySelector(".add-task");
let addDateBtn = document.querySelector(".add-date");
let cont = document.querySelector(".cont");
let temp = document.querySelector(".myTemp");
let backBtn = document.querySelector(".back-button");
let deleteBtn = document.querySelector(".delete-button");
let deleteFlag = false;

backBtn.addEventListener("click",handleBack);
deleteBtn.addEventListener("click",handleDeleteBtn);
addDateBtn.addEventListener("click",handleAddDate);
addTaskBtn.addEventListener("click",handleAddTask);
let resources = [];
let cfid = -1;
let dateId = 0;
if(cfid==-1){
    addTaskBtn.style.display = "none";
    backBtn.style.display = "none";
} 
function handleAddDate(){
    let date = prompt("Enter the date");
    if(!date) return;
    dateId++;
    let pid = cfid;
    resources.push({
        date:date,
        dateId:dateId,
        pid:pid,
        type:"date"
    })
    addDateIntoHtml(date,dateId,pid);
    saveToStorage();
}
function addDateIntoHtml(date,dateId,pid){
    let todayDate = (new Date()).toLocaleDateString('en-GB');
    let dateTemp = temp.content.querySelector(".dateFolder");
    let dateFolder = document.importNode(dateTemp,true);
    let dateText = dateFolder.querySelector(".enteredDate");
    dateText.innerText = date;
    dateFolder.setAttribute("dateId",dateId); 
    dateFolder.setAttribute("pid",pid); 
    cont.prepend(dateFolder);
    let isToday = (String(todayDate) == date.substring(0, date.indexOf(' ')));
    if(isToday){
        dateFolder.style.border = "6px solid white";
    }
    dateFolder.addEventListener("dblclick",handleView);
    dateFolder.addEventListener("click",handleDateDelete);

}
function handleDateDelete() {
    if(deleteFlag){
        this.remove();
        let tid = Number(this.getAttribute("dateId"));
       let taskIdIdx = resources.findIndex(f=>f.dateId == tid);
       resources.splice(taskIdIdx,1);
       saveToStorage();
    }
}

function saveToStorage(){
    localStorage.setItem("TaskManager",JSON.stringify(resources));
}

function loadFromStorage(){
    let data = localStorage.getItem("TaskManager");
    if(!data) return;
    resources = JSON.parse(data);

    for(let i = 0; i < resources.length; i++){
        if(resources[i].pid == cfid){
            if(resources[i].type == "date"){

                addDateIntoHtml(resources[i].date, resources[i].dateId, resources[i].pid);
            }else if(resources[i].type == "task"){
                addTaskIntoHTML(resources[i].topic,resources[i].taskName,resources[i].dateId,resources[i].completed);
            }
        }
        if(resources[i].dateId > dateId){
            dateId = resources[i].dateId;
        }
    }
}
loadFromStorage();


function handleView(){
    addDateBtn.style.display = "none";
    deleteBtn.style.display = "none";
    addTaskBtn.style.display = "flex";
    backBtn.style.display = "flex";

    let dateFolder = this;
    let dateId = parseInt(dateFolder.getAttribute("dateId"));
    cfid = dateId;
    cont.innerHTML = "";
    for(let i = 0; i < resources.length; i++){
        if(resources[i].pid == cfid){
            if(resources[i].type == "date"){

                addDateIntoHtml(resources[i].date, resources[i].dateId, resources[i].pid);
            }else if(resources[i].type == "task"){
                addTaskIntoHTML(resources[i].topic,resources[i].taskName,resources[i].dateId,resources[i].completed,resources[i].pid);
            }
        }
        if(resources[i].dateId > dateId){
            dateId = resources[i].dateId;
        }
    }
}

function handleBack(){
    addDateBtn.style.display = "flex";
    deleteBtn.style.display = "flex";
    addTaskBtn.style.display = "none";
    backBtn.style.display = "none";
    cfid = -1;
    cont.innerHTML = "";
    for(let i = 0; i < resources.length; i++){
        if(resources[i].pid == cfid){
            if(resources[i].type == "date"){

                addDateIntoHtml(resources[i].date, resources[i].dateId, resources[i].pid);
            }else if(resources[i].type == "task"){
                addTaskIntoHTML(resources[i].topic,resources[i].taskName,resources[i].dateId,resources[i].completed,resources[i].pid);
            }
        }
        if(resources[i].dateId > dateId){
            dateId = resources[i].dateId;
        }
    }
}



function handleAddTask(){
    let input = prompt("Enter the topic and task")
    let topic = input.substring(0, input.indexOf(' '));
    if(topic==null) {
        alert("Please Enter the Topic and Task both seperated by a space");
        return;
    }
    let taskName = input.substring(input.indexOf(' ') + 1);
    if(taskName==null || taskName=="") {
        alert("Please Enter the task");
        return;
    }
    let completed = false;
    let pid = cfid;
    dateId++;
    resources.push({
        dateId: dateId,
        taskName: taskName,
        topic: topic,
        completed:completed,
        pid:pid,
        type:"task",
    });
    saveToStorage();
    addTaskIntoHTML(topic,taskName,dateId,completed);
}

function addTaskIntoHTML(topic,taskName,dateId,completed,pid){
    let taskTemplate = temp.content.querySelector(".taskBody");
    let task = document.importNode(taskTemplate,true);
    let taskDesc = task.querySelector(".taskDesc");
    let taskTopic = task.querySelector(".topic");
    let taskStatus = task.querySelector(".taskStatus");
    let taskCheck = task.querySelector(".check");
    let deleteBtn = task.querySelector(".delete");
    taskDesc.innerHTML = taskName;
    taskTopic.innerHTML = topic;
    task.setAttribute("taskid",dateId);
    task.setAttribute("pid",pid);
    if(completed==true){
     taskStatus.innerHTML = "Completed";
     setTimeout(() => {  
         taskCheck.click();
     }, 10);
    }
    cont.append(task);
    
    taskCheck.addEventListener("click",handleCheck);
    deleteBtn.addEventListener("click",handleDelete);
}
function handleDelete(){
    let tid = Number(this.parentNode.parentNode.getAttribute("taskid"));
    this.parentNode.parentNode.remove();
    let taskIdIdx = resources.findIndex(f=>f.dateId == tid);
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
        task.style.backgroundColor = "#b33939"
        cont.append(task);
        let resource = resources.find(f=>f.dateId == taskId);
        resource.completed = true;
        saveToStorage();
    }else{
        taskStatus.innerText = "Not Completed";
        this.setAttribute("isChecked","false");
        task.setAttribute("completed","false");
        task.style.backgroundColor = "#2d3436";
        let resource = resources.find(f=>f.dateId == taskId);
        resource.completed = false;
        saveToStorage();
    }
    
}


function handleDeleteBtn(){
    deleteFlag = !deleteFlag;
    if(deleteFlag){
        deleteBtn.style.border = "5px solid red";
        deleteBtn.style.color = "red";
    }else{
        deleteBtn.style.border = "5px solid white";
        deleteBtn.style.color = "white";
    }
}