var display = document.getElementById("display").getContext("2d");

display.canvas.height=180;
display.canvas.width=320;

display.fillStyle = "#2C001E";
display.fillRect(0,0,320,180);

display.strokeStyle = "#ffffff";
display.lineJoin="round";
display.lineWidth=2;

// Draw the triangle:
display.fillStyle= "#00ff00";
display.beginPath();
display.moveTo(10,10);
display.lineTo(10,90);
display.lineTo(90,10);
display.closePath();
display.fill();
// Add the contour line
display.stroke();

display.beginPath();
display.moveTo(0,180);
display.bezierCurveTo(80,0,80,180,160,90); //Control point 1 and 2 and then the final point
display.bezierCurveTo(240,0,240,180,320,0); //Control point 1 and 2 and then the final point
display.stroke();

display.fillStyle = "#0000ff";
display.beginPath();
display.rect(180,130,40,40);
display.fill();
display.stroke();

display.fillStyle = "#ff0000";
display.beginPath();
display.arc(290,120,20,0,Math.PI*2);
display.fill();
display.stroke();


var input = document.getElementById("input");
var output = document.getElementById("output");

var counter = 0;

var click = function(event) {

  counter += 1;
  output.innerHTML = "You clicked " + counter + " times!";
  x = Math.floor(Math.random() * 320);
  y = Math.floor(Math.random() * 180);
  display.fillStyle = "#0000ff";
  display.beginPath();
  display.rect(x,y,5,5);
  display.fill();
  display.stroke();
}

input.addEventListener("click", click);
