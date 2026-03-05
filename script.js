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

add_b.addEventListener('click', function(){
    if(isActive === true){
        let newItem = document.createElement("li");
        newItem.id = idCounter;
        idCounter++;
        newItem.textContent = prompt("Input text...");
        list.appendChild(newItem);
        activeArray[activeArrayIndex] = newItem.textContent;
        activeArrayIndex++;
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