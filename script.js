let add_b = document.getElementById("add");
let input_sp = document.getElementById("input-text");

add_b.addEventListener('click', function(){
    input_sp.innerText += prompt("Input text...");
    input_sp.innerText += "\n"
});