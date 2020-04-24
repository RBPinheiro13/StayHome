var input = document.getElementById("input");
var output = document.getElementById("output");

var counter = 0;

var click = function(event) {

  counter += 1;
  output.innerHTML = "You clicked " + counter + " times!";

}

input.addEventListener("click", click);
