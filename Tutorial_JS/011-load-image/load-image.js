// Frank Poth 12/22/2017

(function() { "use strict";

  /* load0 is the simplest way to get an image, but it's lazy and may not work.
     load1 is an easy way to load an image, but it won't give you load progress events.
     load2 is the most complex way to load an image, but it WILL give you load progress events. */
  var buffer, display, images, load, render, resize;

  /* I use a buffer and a display canvas for easy scaling of the final image. */
  buffer = document.createElement("canvas").getContext("2d");
  display = document.querySelector("canvas").getContext("2d");
  images = new Array();// This will hold our loaded images.

  /* This is probably the most common method. It's simple and easy, and most importantly,
  it works. Using a load event listener prevents you from getting progress reports, but
  for a small web game this probably doesn't matter much unless you're really into
  accurate loading screens. */
  load = function(n,path) {

    let image = new Image();// First we must create a new Image object.

    /* We have to store the image and draw it whenever it loads, so let's make
    an event handler for the load event. */
    image.addEventListener("load", function(event) {

      /* When the image loads, we store it in the images array and draw it. */
      images[n] = this;
      render();

    });

    /* Setting the image's src will initiate loading, and eventually a load eventually
    will fire and we can have access to our image. */
    image.src = path;

  };

  /* This renders the loaded images to the buffer and then to the display canvas. */
  render = function() {

    var x = 0;

    buffer.fillStyle = "#333333";
    buffer.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

    for (let index = images.length - 1; index > -1; -- index) {

      let image = images[index];

      buffer.drawImage(image, 0, 0, image.width, image.height, x, 0, image.width, image.height);

      x += image.width;

    }

    /* Handles scaling of buffer to display as well. */
    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);

  };

  /* Make sure everything fits nicely in the window, and redraws on screen resize events. */
  resize = function(event) {

    display.canvas.width = document.documentElement.clientWidth - 32;

    if (display.canvas.width > document.documentElement.clientHeight) {

      display.canvas.width = document.documentElement.clientHeight;

    }

    /* make sure we're maintaining aspect ratio. 1 image high, by 3 wide. */
    display.canvas.height = display.canvas.width * 1/3;

    display.imageSmoothingEnabled = false;// This keeps the image looking sharp.

    render();


  };

  window.addEventListener("resize", resize);

  /* We have 2 50x60 and 1 57x48 images, so the buffer should fit them exactly. */
  buffer.canvas.height = 60;
  buffer.canvas.width = 180;

  resize();

  load(0,"run_left.png");
  alert("0");
  load(1,"run_right.png");
  alert("1");
  load(2,"stop_R.png");
  alert("2");

  // Manage the click and show how many times
  var input = document.getElementById("input");
  var output = document.getElementById("output");

  var counter = 0;

  var click = function(event) {

    counter += 1;
    output.innerHTML = "You clicked " + counter + " times!";

  }

  input.addEventListener("click", click);


})();
