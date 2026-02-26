let add_b = document.getElementById("add");
let idCounter = 1;

add_b.addEventListener('click', function(){
    let list = document.getElementById("list");
    let newItem = document.createElement("li");
    newItem.id = idCounter;
    idCounter++;
    newItem.textContent = prompt("Input text...");
    list.appendChild(newItem);
});