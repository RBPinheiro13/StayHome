

var time="3:43";

// First object
var rectangle = {

  x:0,
  y:10,
  width:100,
  height:200,
  // Defining a function inside an object "rectangle"
  print:function(a) {

    console.log(this.width + ", " + a);

  }

};

console.log(rectangle.x + ", " + rectangle.y);

rectangle.print("I'm a rectangle, bro!");

function sayHello() {

  alert("Hello!")

}

// This function will overwrite the first one!!!
var sayHello = function() {

  alert("Hello,2!")

}

sayHello();
