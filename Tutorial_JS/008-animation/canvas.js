var context, character, loop;

context = document.getElementById("context").getContext("2d");

context.canvas.height=180;
context.canvas.width=320;

character = {

  height:64,
  width:32,
  x:0,
  y:72,

}

context.fillStyle = "#2C001E";
context.fillRect(0,0,320,180);

loop = function(){

  character.x+=1;
  context.fillStyle = "#2C001E";
  context.fillRect(0,0,320,180);

  context.fillStyle="#ff0000"
  context.beginPath();
  context.rect(character.x,character.y,character.width,character.height);
  context.fill()

  if (character.x>320) {
    character.x=-32;
  }

  // Stays here forever!!!
  window.requestAnimationFrame(loop);

};

// Start the game loop!!!
window.requestAnimationFrame(loop);

var input = document.getElementById("input");
var output = document.getElementById("output");

var counter = 0;

var click = function(event) {

  counter += 1;
  output.innerHTML = "You clicked " + counter + " times!";
  x = Math.floor(Math.random() * 320);
  y = Math.floor(Math.random() * 180);
  context.fillStyle = "#0000ff";
  context.beginPath();
  context.rect(x,y,5,5);
  context.fill();
  context.stroke();
}

input.addEventListener("click", click);
