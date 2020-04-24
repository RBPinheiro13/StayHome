var context, character, loop, controller;

context = document.getElementById("context").getContext("2d");

context.canvas.height=180;
context.canvas.width=640;

character = {

  jumping:true,
  height:64,
  width:32,
  x:144,
  y:72,
  x_velocity:0,
  y_velocity:0,

}

controller = {

  left:false,
  right:false,
  up:false,
  keyListener:function(event) {

    //Check if the key is being pressed or released
    var key_state = (event.type == "keydown")?true:false;

    //Check which key the user pressed
    switch(event.keyCode) {

      case 37://left key
        controller.left = key_state;
      break;
      case 38: // up key
        controller.up = key_state;
      break;
      case 39:
        controller.right = key_state;
      break;

    }

  }

}

loop = function() {

  if (controller.up && !character.jumping) {

    character.y_velocity -= 20;
    character.jumping = true;

  }

  if (!controller.up && character.jumping && character.y==(context.canvas.height - 16 - character.height)) {

    character.jumping = false;

  }

  if (controller.left) {

    character.x_velocity -= 0.5;

  }

  if (controller.right) {

    character.x_velocity += 0.5;

  }

  character.y_velocity +=1.5; //gravity
  character.x += character.x_velocity;
  character.y += character.y_velocity;
  character.x_velocity *=0.9;//friction
  character.y_velocity *=0.9;//friction

  //Defining the floor!!!
  if (character.y > context.canvas.height - 16 - character.height) {

    character.y = context.canvas.height - 16 - character.height;
    character.y_velocity = 0;


  }

  // Teleporting from end of screen to the other end
  if (character.x < -character.width) {
    character.x = context.canvas.width;
  }

  else if (character.x > context.canvas.width) {
    character.x = -character.width;
  }

  context.fillStyle = "#2C001E";
  context.fillRect(0,0,context.canvas.width,context.canvas.height);

  context.fillStyle="#ff0000"
  context.beginPath();
  context.rect(character.x,character.y,character.width,character.height);
  context.fill();

  context.strokeStyle = "#202830";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0,164);
  context.lineTo(context.canvas.width,164);
  context.stroke();

  // Stays here forever!!!
  window.requestAnimationFrame(loop);

}

// Check if the user input any keys!
window.addEventListener("keydown",controller.keyListener);
window.addEventListener("keyup",controller.keyListener);
// Start the game loop!!!
window.requestAnimationFrame(loop);

var input = document.getElementById("input");
var output = document.getElementById("output");

var counter = 0;

var click = function(event) {

  counter += 1;
  output.innerHTML = "You clicked " + counter + " times!";

}

input.addEventListener("click", click);
