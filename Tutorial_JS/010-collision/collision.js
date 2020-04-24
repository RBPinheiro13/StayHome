var context, Character, loop, controller, resize, red, white;

context = document.getElementById("context").getContext("2d");

context.canvas.height=180;
context.canvas.width=640;

controller = {

  //mouse or finger
  pointer_x:0,
  pointer_y:0,

  move:function(event) {

    var rectangle=context.canvas.getBoundingClientRect();

    controller.pointer_x = event.clientX-rectangle.left;
    controller.pointer_y = event.clientY-rectangle.top;

  }

};

Character = function(x,y,width,height,color){

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.color = color;

}
Character.prototype = {

  draw:function() {

    context.fillStyle=this.color;
    context.beginPath();
    context.rect(this.x,this.y,this.width,this.height);
    context.fill();

  },

  // Get the 4 sides coordinates of the rectangle
  get bottom(){ return this.y+this.height;},
  get left(){ return this.x;},
  get right(){ return this.x+this.width;},
  get top(){ return this.y;},

  testCollision:function(rectangle) {

    if (this.top>rectangle.bottom || this.right<rectangle.left || this.left > rectangle.right || this.bottom<rectangle.top) {

      return false;

    }
    else {

      return true;

    }

  }

};

red = new Character(0, 0, 64, 64, "#ff0000");
white = new Character(context.canvas.width*0.5-32, context.canvas.height*0.5-32, 64, 64, "#ffffff");

loop = function(time_stamp) {

  red.x = controller.pointer_x - 32;
  red.y = controller.pointer_y - 32;

  context.fillStyle="#333333";
  context.fillRect(0,0,context.canvas.width,context.canvas.height);

  white.draw();
  red.draw();

  if(red.testCollision(white)) {

    context.beginPath();
    context.rect(red.x,red.y,red.width,red.height);
    context.rect(white.x,white.y,white.width,white.height);
    context.strokeStyle="#ffffff";
    context.stroke();

  }
  // Stays here forever!!!
  window.requestAnimationFrame(loop);


};

// just keeps the canvas element sized appropriately
resize = function(event) {

  context.canvas.width = document.documentElement.clientWidth - 32;

  if (context.canvas.width > document.documentElement.clientHeight) {

    context.canvas.width = document.documentElement.clientHeight;

  }

  context.canvas.height = Math.floor(context.canvas.width * 0.5625);

  white.x = context.canvas.width * 0.5 - 32;
  white.y = context.canvas.height * 0.5 - 32;

};

context.canvas.addEventListener("mousemove", controller.move);
context.canvas.addEventListener("touchmove", controller.move, {passive:true});

window.addEventListener("resize", resize, {passive:true});

resize();

// start the game loop
window.requestAnimationFrame(loop);


// Manage the click and show how many times
var input = document.getElementById("input");
var output = document.getElementById("output");

var counter = 0;

var click = function(event) {

  counter += 1;
  output.innerHTML = "You clicked " + counter + " times!";

}

input.addEventListener("click", click);
