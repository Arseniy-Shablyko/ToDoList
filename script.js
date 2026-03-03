let add_b = document.getElementById("add");
let idCounter = 1;
let list = document.getElementById("list");
let activeArrayIndex = 0;
let activeArray = [];
let doneArrayIndex = 0;
let doneArray = [];

add_b.addEventListener('click', function(){
    let newItem = document.createElement("li");
    newItem.id = idCounter;
    idCounter++;
    newItem.textContent = prompt("Input text...");
    list.appendChild(newItem);
    activeArray[activeArrayIndex] = newItem.textContent;
    activeArrayIndex++;
});

list.addEventListener('click', function(event){
    if(event.target.tagName === 'LI'){
        let text = event.target.innerText;
        doneArray[doneArrayIndex] = text;
        doneArrayIndex++;
        activeArray = activeArray.filter(item => item !== text);
        activeArrayIndex--;
        event.target.remove();
    }
});