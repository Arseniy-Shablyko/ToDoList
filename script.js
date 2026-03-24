let add_b = document.getElementById("add");
let done_b = document.getElementById("done-page");
let active_b = document.getElementById("active-page");
let delet_b = document.getElementById("deleted-page");
let idCounter = 1;
let list = document.getElementById("list");
let activeArrayIndex = 0;
let activeArray = [];
let doneArrayIndex = 0;
let doneArray = [];
let deletArray = [];
let deletArrayIndex = 0;
let isActive = true;

document.addEventListener("DOMContentLoaded", function(){
    let jsonarray_done = localStorage.getItem('done');
    doneArray = JSON.parse(jsonarray_done) || [];

    let jsonarray_deleted = localStorage.getItem('deleted');
    deletArray = JSON.parse(jsonarray_deleted) || [];
    
    let jsonarray_active = localStorage.getItem('active');
    activeArray = JSON.parse(jsonarray_active) || [];
    activeArray = JSON.parse(activeArray);  
});

window.addEventListener('load', function(){
    console.log(doneArray.length);
    console.log(deletArray.length);

    doneArrayIndex += doneArray.length;
    deletArrayIndex += deletArray.length;

    activeArrayIndex += activeArray.length;
    activeArray.forEach((item, index) => {
        let newItem = document.createElement("li");
        newItem.textContent = activeArray[index];
        list.appendChild(newItem);
    });

    doneArray = JSON.parse(doneArray);
    deletArray = JSON.parse(deletArray);
});

add_b.addEventListener('click', function(){
    if(isActive === true){
        let newItem = document.createElement("li");
        newItem.id = idCounter;
        idCounter++;
        newItem.textContent = prompt("Input text...");
        list.appendChild(newItem);
        activeArray[activeArrayIndex] = newItem.textContent;
        activeArrayIndex++;
        localStorage.setItem('active', JSON.stringify(activeArray));
    }
});

list.addEventListener('click', function(event){
    if(isActive === true){
        if(event.target.tagName === 'LI'){
            let text = event.target.innerText;
            doneArray[doneArrayIndex] = text;
            doneArrayIndex++;
            activeArray = activeArray.filter(item => item !== text);
            activeArrayIndex--;
            event.target.remove();
            localStorage.setItem('done', JSON.stringify(doneArray));
            localStorage.setItem('active', JSON.stringify(activeArray));
        } 
    }
});

list.addEventListener('contextmenu', function(event){
    if(isActive === true){
        if(event.target.tagName === 'LI'){
            let text = event.target.innerText;
            deletArray[deletArrayIndex] = text;
            deletArrayIndex++;
            activeArray = activeArray.filter(item => item !== text);
            activeArrayIndex--;
            event.target.remove();
            localStorage.setItem('deleted', JSON.stringify(deletArray));
            localStorage.setItem('active', JSON.stringify(activeArray));
        } 
    }
});

done_b.addEventListener('click', function(){
    list.innerText = '';
    doneArray.forEach((element) => {
        let newItem = document.createElement("li");
        newItem.textContent = element;
        list.appendChild(newItem);
    });
    isActive = false;
});

active_b.addEventListener('click', function(){
    list.innerText = '';
    activeArray.forEach((element) => {
        let newItem = document.createElement("li");
        newItem.textContent = element;
        list.appendChild(newItem);
    });
    isActive = true;
});

delet_b.addEventListener('click', function(){
    list.innerText = '';
    deletArray.forEach((element) => {
        let newItem = document.createElement("li");
        newItem.textContent = element;
        list.appendChild(newItem);
    });
    isActive = false;
});