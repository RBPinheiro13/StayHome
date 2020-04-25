(function() { "use strict";

/* Each sprite sheet tile is 60x60 pixels in dimension. Ichigo's size*/
const SPRITE_SIZE = 60;

/* The Animation class manages frames within an animation frame set. The frame
set is an array of values that correspond to the location of sprite images in
the sprite sheet. For example, a frame value of 0 would correspond to the first
sprite image / tile in the sprite sheet. By arranging these values in a frame set
array, you can create a sequence of frames that make an animation when played in
quick succession. */
var Animation = function(frame_set, delay) {

  this.count = 0;// Counts the number of game cycles since the last frame change.
  this.delay = delay;// The number of game cycles to wait until the next frame change.
  this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
  this.frame_index = 0;// The frame's index in the current animation frame set.
  this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

};

Animation.prototype = {

  /* This changes the current animation frame set. For example, if the current
  set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
  sets the delay. */
  change:function(frame_set, delay = 15) {

    if (this.frame_set != frame_set) {// If the frame set is different:

      this.count = 0;// Reset the count.
      this.delay = delay;// Set the delay.
      this.frame_index = 0;// Start at the first frame in the new frame set.
      this.frame_set = frame_set;// Set the new frame set.
      this.frame = this.frame_set[this.frame_index];// Set the new frame value.

    }

  },

  /* Call this on each game cycle. */
  update:function() {

    this.count ++;// Keep track of how many cycles have passed since the last frame change.
    if ((this.frame==3 || this.frame==7) && this.count >= 5) {

      this.count = 0;// Reset the count.
      /* If the frame index is on the last value in the frame set, reset to 0.
      If the frame index is not on the last value, just add 1 to it. */
      this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index];// Change the current frame value.

    }

    if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

      this.count = 0;// Reset the count.
      /* If the frame index is on the last value in the frame set, reset to 0.
      If the frame index is not on the last value, just add 1 to it. */
      this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index];// Change the current frame value.

    }

  }

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Class to create the controller and the inputs //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Input = function(active, state) {

  this.active = active;
  this.state  = state;

};

Input.prototype = {

  constructor:Input,

  update:function(state) {

    if (this.state != state) this.active = state;
    this.state  = state;

  }

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Class to create the doors and passages  ///// //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Passage = function(x, y, width, height, destination_zone, destination_x, destination_y) {

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.destination_zone = destination_zone;
  this.destination_x = destination_x;
  this.destination_y = destination_y;


};

Passage.prototype = {

  constructor:Passage,

};

const Door = function(x, y, width, height, image, destination_zone, destination_x, destination_y) {

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.destination_zone = destination_zone;
  this.destination_x = destination_x;
  this.destination_y = destination_y;
  this.image = image;

};

Door.prototype = {

  constructor:Door,

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Class to create touchscreen support  ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var TouchButton = function(x, y, width, height,text, color) {

  this.active = false;
  this.color = color;
  this.height = height;
  this.width = width;
  this.text = text;
  this.x = x;
  this.y = y;

}

TouchButton.prototype = {

  // returns true if the specified point lies within the rectangle:
  containsPoint:function(x, y) {

    // if the point is outside of the rectangle return false:
    if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) {

      return false;

    }

    return true;

  }

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Classes for the game logic  ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var controller, display, game;

display = {

  buffer:document.createElement("canvas").getContext("2d"),
  // buffer2:document.createElement("canvas"),
  context:document.querySelector("canvas").getContext("2d"),
  output:document.getElementById("output"),
  // output:document.querySelector("p"), // used to show output in browser window
  bounding_rectangle:undefined,
  /* The sprite sheet object holds the sprite sheet graphic and some animation frame
  sets. An animation frame set is just an array of frame values that correspond to
  each sprite image in the sprite sheet, just like a tile sheet and a tile map. */
  sprite_sheet:{

    frame_sets:[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]],// standing right, standing left, walk right, walk left
    image:new Image()

  },

  render:function() {
    /* Draw the background. */
    if (!background_loaded[0]) {
      display.buffer.fillStyle = "#7ec0ff";
      display.buffer.fillRect(0, 0, display.buffer.canvas.width, display.buffer.canvas.height);
      display.buffer.fillStyle = "#009900";
      display.buffer.fillRect(0, (display.buffer.canvas.height-8), display.buffer.canvas.width, 8);
    }
    else {
      display.buffer.drawImage(background[game.world.background],0,0,display.buffer.canvas.width,display.buffer.canvas.height);
    }

    //Draw the floor
    display.buffer.fillStyle = "#667882";
    display.buffer.fillRect(0, (display.buffer.canvas.height-8), display.buffer.canvas.width, 8);

    /* When you draw your sprite, just use the animation frame value to determine
    where to cut your image from the sprite sheet. It's the same technique used
    for cutting tiles out of a tile sheet. Here I have a very easy implementation
    set up because my sprite sheet is only a single row. */
    // draw the collectibles and the obstacles
    if(!game.area_visited[game.world.id]) {
      for (let index = game.world.map.length - 1; index > -1; -- index) {

        if (game.world.map[index] == 1) {

          this.buffer.drawImage(orb,(index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);
        }
      };
    }

    for (let index = game.world.graphics_map.length - 1; index > -1; -- index) {

      if (game.world.graphics_map[index] != 0) {

          this.buffer.drawImage(obstacles_image,game.world.graphics_map[index]%4*game.world.tile_size, Math.floor(game.world.graphics_map[index]/4)*game.world.tile_size, game.world.tile_size, game.world.tile_size,(index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size-game.world.floor, game.world.tile_size, game.world.tile_size);

      };
    }


    // draw the doors
    for (let index = game.world.doors.length - 1; index > -1; -- index) {

      let door = game.world.doors[index];

      display.buffer.drawImage(door_image[door.image],door.x,door.y,door.width,door.height);

    }

    // Draw the player
    this.buffer.drawImage(this.sprite_sheet.image, game.player.animation.frame%4 * SPRITE_SIZE, Math.floor(game.player.animation.frame/4)* SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE, Math.floor(game.player.x), Math.floor(game.player.y), SPRITE_SIZE, SPRITE_SIZE);

    if(game.world.id!=19) {

      this.buffer.font="lighter 15px Arial";
      this.buffer.fillStyle = "red";
      this.buffer.fillText("Spiritual Energy: "+game.orb_count, 10,15);

    }
    else  {

      this.buffer.font = "30px Comic Sans MS";
      this.buffer.fillStyle = "black";
      this.buffer.textAlign = "center";
      this.buffer.fillText("Game Over", this.buffer.canvas.width/2, this.buffer.canvas.height/2-30);
      this.buffer.font = "15px Comic Sans MS";
      this.buffer.fillText("Created by: Rodrigo Borba Pinheiro", this.buffer.canvas.width/2, this.buffer.canvas.height/2);

    }


    this.context.drawImage(display.buffer.canvas, 0, 0, display.buffer.canvas.width, display.buffer.canvas.height, 0, 0, display.context.canvas.width, display.context.canvas.height/touch_sz);

    if(touchscreen){this.renderButtons(controller.buttons);};


    // this.output.innerHTML = "tile_x: " + game.player.tile_x + "<br>tile_y: " + game.player.tile_y + "<br>map index: " + game.player.tile_y + " * " + game.world.columns + " + " + game.player.tile_x + " = " + String(game.player.tile_y * game.world.columns + game.player.tile_x + "Zone " +game.world.id);
    this.output.innerHTML = "Zone " +game.world.id;

  },

  renderButtons:function(buttons) {

  var button, index;

  this.context.fillStyle = "#202830";
  this.context.fillRect(0, this.context.canvas.height/touch_sz, this.context.canvas.width, this.context.canvas.height);

  for (index = buttons.length - 1; index > -1; -- index) {

    button = buttons[index];

    this.context.fillStyle = button.color;
    this.context.fillRect(button.x/display.buffer_output_ratio, button.y/display.buffer_output_ratio, button.width/display.buffer_output_ratio, button.height/display.buffer_output_ratio);

    this.context.fillStyle = "#ffffff"
    var letter_sz = 40/display.buffer_output_ratio;
    this.context.font = String(letter_sz)+"px Arial";
    this.context.fillText(button.text, button.x/display.buffer_output_ratio+button.width/display.buffer_output_ratio*0.15, button.y/display.buffer_output_ratio+button.height/display.buffer_output_ratio*0.7);
  }

},

  resize:function() {

      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (display.context.canvas.width > client_height) {

        display.context.canvas.width = client_height;

      }

      display.context.canvas.height = Math.floor(display.context.canvas.width * 0.5 * touch_sz);

      display.bounding_rectangle = display.context.canvas.getBoundingClientRect();
      display.buffer_output_ratio = display.buffer.canvas.width / display.context.canvas.width;

    display.context.imageSmoothingEnabled = false;

  },

};

controller = {

  /* Now each key object knows its physical state as well as its active state.
  When a key is active it is used in the game logic, but its physical state is
  always recorded and never altered for reference. */
  buttons:[
    new TouchButton(10, 185, 60, 60,"▲", "#f09000"),
    new TouchButton(80, 185, 60, 60,"▼", "#f09000"),
    new TouchButton(220, 185, 60, 60,"◄", "#0090f0"),
    new TouchButton(290, 185, 60, 60,"►", "#0090f0")

  ],

  testButtons:function(target_touches) {

    var button, index0, index1, touch;

    // loop through all buttons:
    for (index0 = this.buttons.length - 1; index0 > -1; -- index0) {

      button = this.buttons[index0];
      button.active = false;

      // loop through all touch objects:
      for (index1 = target_touches.length - 1; index1 > -1; -- index1) {

        touch = target_touches[index1];

        // make sure the touch coordinates are adjusted for both the canvas offset and the scale ratio of the buffer and output canvases:
        if (button.containsPoint((touch.clientX - display.bounding_rectangle.left) * display.buffer_output_ratio, (touch.clientY - display.bounding_rectangle.top) * display.buffer_output_ratio)) {

          button.active = true;
          break;// once the button is active, there's no need to check if any other points are inside, so continue

        }

      }

    }
  },

  touchEnd:function(event) {

    event.preventDefault();
    controller.testButtons(event.targetTouches);

  },

  touchMove:function(event) {

    event.preventDefault();
    controller.testButtons(event.targetTouches);

  },

  touchStart:function(event) {

    event.preventDefault();
    controller.testButtons(event.targetTouches);

  },

  left:  new Input(false,false),
  right: new Input(false,false),
  up:    new Input(false,false),
  down:  new Input(false,false),
  attack: new Input(false,false),

  keyUpDown:function(event) {

    /* Get the physical state of the key being pressed. true = down false = up*/
    var key_state = (event.type == "keydown") ? true : false;

    switch(event.keyCode) {

      /* If the virtual state of the key is not equal to the physical state
      of the key, we know something has changed, and we must update the active
      state of the key. By doing this it prevents repeat firing of keydown events
      from altering the active state of the key. Basically, when you are jumping,
      holding the jump key down isn't going to work. You'll have to hit it every
      time, but only if you set the active key state to false when you jump. This
      is all managed by the Input class and its update function*/

      case 37:controller.left.update(key_state);break;
      case 38:controller.up.update(key_state);break;
      case 39:controller.right.update(key_state);break;
      case 40:controller.down.update(key_state);break;
      // case 37:controller.attack.update(key_state);break;
    }

  }

};

/* The player object is just a rectangle with an animation object. */
game = {

  orb_count:0,
  area_visited:[],
  player: {
    animation:new Animation(),// You don't need to setup Animation right away.
    jumping:true,
    height:60,    width:60,
    x:0,          y:120,
    old_x:undefined, old_y:undefined,
    x_velocity:0, y_velocity:0,
    tile_x:undefined,// the x and y tile positions of the player
    tile_y:undefined,
    last_mov:"R",

    update:function() {

      this.y_velocity += 0.035;

      this.old_x = this.x;// store the last position of the player
      this.old_y =this.y;// before we move it on this cycle

      this.x += this.x_velocity;
      this.y += this.y_velocity;

      this.x_velocity *= 0.9;
      this.y_velocity *= 0.9;

    },

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////// Detect Collision with the floor ////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////

    floor_wall_collision:function() {

      if (this.y + this.height > display.buffer.canvas.height - game.world.floor) {

        this.jumping = false;
        this.y = display.buffer.canvas.height - game.world.floor - this.height;
        this.y_velocity = 0;

      };

      if (this.x + this.width/2 < 0) {

        this.x = - this.width/2;

      } else if (this.x + this.width/2 > display.buffer.canvas.width) {

        this.x =  display.buffer.canvas.width-this.width/2;

      };


    }
  },

  world:undefined,

  collision: {

      // the reason these functions are indexed with numbers is because they
      // correspond directly to tile values in the map array. For instance, this
      // function handles collision for any tile in the map with a value of 1
      // it handles collision detection and response on the specified player object
      // at the specified row and column in the tile map. the 1 tile collision
      // shape has a flat top and a flat right side, so only test for collision
      // and do response on those sides.

      // the 2 tile type has a top and a left side to collide with
      2:function(object, row, column) {

        if (this.rightCollision(object, row)) { return; }
        this.leftCollision(object, column);

      },

      // the 3 tile type has collision on all sides but the bottom
      3:function(object, row, column) {

        if (this.topCollision(object, row)) { return; }// you only want to do one
        if (this.leftCollision(object, column)) { return; }// of these collision
        this.rightCollision(object, column);// responses. that's why there are if statements


      },

      /* This function handles collision with a rightward moving object. Another
      design requirement to use this method is that objects must have a record of
      their current and last physical position. A collision can only occur when a
      player enters into a collision shape through its boundary. It's foolproof so
      long as you always spawn your players on empty tiles and not in the walls. */
      leftCollision(object, column) {

        if (object.x-object.old_x > 0) {// If the object is moving right

          var left = column * game.world.tile_size;// calculate the left side of the collision tile

          if (object.x + object.width * 0.5 > left && object.old_x <= left) {// If the object was to the right of the collision object, but now is to the left of it

            object.velocity_x = 0;// Stop moving
            object.x = object.old_x = left - object.width * 0.5 - 0.001;// place object outside of collision
            // the 0.001 is just to ensure that the object is no longer in the same tile space as the collision tile
            // due to the way object tile position is calculated, moving the object to the exact boundary of the collision tile
            // would not move it out if its tile space, meaning that another collision with an adjacent tile might not be detected in another broad phase check

            return true;

          }

        }

        return false;

      },

      // these are all basically the same concept as the leftCollision function,
      // only for the different sides.

      rightCollision(object, column) {

        if (object.x-object.old_x < 0) {

          var right = (column + 1) * game.world.tile_size;

          if (object.x + object.width * 0.5 < right && object.old_x + object.width * 0.5 >= right) {

            object.velocity_x = 0;
            object.old_x = object.x = right - object.width * 0.5;

            return true;

          }

        }

        return false;

      },

      topCollision(object, row) {

        if (object.y-object.old_y > 0) {

          var top = row * game.world.tile_size;

          if (object.y + object.height > top && object.old_y + object.height <= top) {

            object.jumping = false;
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;

            return true;

          }

        }

        return false;

      }

    },

  engine: {

    accumulated_time:window.performance.now(),
    frame_request:undefined,
    time_step:1000/60,

    loop:function(time_stamp) {

      if (controller.up.active && !game.player.jumping) {

        controller.up.active = false;
        game.player.jumping = true;
        game.player.y_velocity -= 12;

      }

      if (controller.left.active) {

        /* To change the animation, all you have to do is call animation.change. */
        game.player.animation.change(display.sprite_sheet.frame_sets[3], 50);
        game.player.x_velocity -= 0.05;
        game.player.last_mov="L";

      }

      if (controller.right.active) {

        game.player.animation.change(display.sprite_sheet.frame_sets[2], 50);
        game.player.x_velocity += 0.05;
        game.player.last_mov="R";

      }

      /* If you're just standing still, change the animation to standing still. */
      if (!controller.left.active && !controller.right.active && game.player.last_mov=="R") {

        game.player.animation.change(display.sprite_sheet.frame_sets[0], 80);

      }

      if (!controller.left.active && !controller.right.active && game.player.last_mov=="L") {

        game.player.animation.change(display.sprite_sheet.frame_sets[1], 80);

      }

      game.player.update();
      game.player.floor_wall_collision();

      // calculate the x and y tile in the map that the player is standing on
      game.player.tile_x = Math.floor((game.player.x+game.player.width * 0.5) / game.world.tile_size);
      game.player.tile_y = Math.floor((game.player.y+game.player.height) / game.world.tile_size);

      var value_at_index = game.world.map[game.player.tile_y * game.world.columns + game.player.tile_x];

      // do some output so we can see it all in action
      // display.output.innerHTML = "tile_x: " + game.player.tile_x + "<br>tile_y: " + game.player.tile_y + "<br>map index: " + game.player.tile_y + " * " + game.world.columns + " + " + game.player.tile_x + " = " + String(game.player.tile_y * game.world.columns + game.player.tile_x) + "<br>tile value: " + value_at_index;

      // if it's not an empty tile, we need to do narrow phase collision detection and possibly response!
      if (value_at_index != 0 && value_at_index != 1 && value_at_index != undefined) {

        // simply call one of the routing functions in the collision object and pass
        // in values for the collision tile's location in grid/map space
        game.collision[value_at_index](game.player, game.player.tile_y, game.player.tile_x);

      }

      game.player.tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_size);
      game.player.tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_size);
      value_at_index = game.world.map[game.player.tile_y * game.world.columns + game.player.tile_x];

      if (value_at_index != 0 && value_at_index != 1 && value_at_index != undefined) {

        game.collision[value_at_index](game.player, game.player.tile_y, game.player.tile_x);

      }

      game.player.tile_x = Math.floor((game.player.x + game.player.width * 0.5) / game.world.tile_size);
      game.player.tile_y = Math.floor((game.player.y + game.player.height) / game.world.tile_size);
      value_at_index = game.world.map[game.player.tile_y * game.world.columns + game.player.tile_x];
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////// Detect Collision with orb to collect/////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////
      if (value_at_index == 1 && !game.area_visited[game.world.id]) {

        game.orb_count ++;
        game.world.map[game.player.tile_y * game.world.columns + game.player.tile_x] = 0;

      };

      game.player.animation.update();

      for (let index = game.world.doors.length - 1; index > -1; -- index) {

        let door = game.world.doors[index];

        if (game.player.x > door.x && game.player.x < door.x + door.width) {

          if (controller.down.active) {

            controller.down.active = false;
            game.player.x = door.destination_x;
            game.loadArea(door.destination_zone, game.reset);
            game.area_visited[game.world.id]=true;
            return;

          }

        }

      }


      for (let index = game.world.passages.length - 1; index > -1; -- index) {

        let passage = game.world.passages[index];

        if (game.player.x > passage.x && game.player.x < passage.x + passage.width) {

          game.player.x = passage.destination_x;
          game.loadArea(passage.destination_zone, game.reset);
          game.area_visited[game.world.id]=true;
          return;

        }

      }

      display.render();

      window.requestAnimationFrame(game.engine.loop);

    },

    start:function() {

      this.accumulated_time = window.performance.now();
      this.frame_request = window.requestAnimationFrame(this.loop);

    },

    stop:function() {

      window.cancelAnimationFrame(this.frame_request);

    }


  },

  loadArea:function(url, callback) {

    var request, readyStateChange;

    request = new XMLHttpRequest();

    readyStateChange = function(event) {

      if (this.readyState == 4 && this.status == 200) {

        game.world = JSON.parse(this.responseText);

        callback();

        game.engine.start();

      }

    };

    request.addEventListener("readystatechange", readyStateChange);
    request.open("GET", url);
    request.overrideMimeType("text/plain");
    request.send(null);

    game.engine.stop();

  },

  reset:function() {

    for (let index = game.world.doors.length - 1; index > -1; -- index) {

      let door = game.world.doors[index];

      game.world.doors[index] = new Door(door.x, door.y, door.width, door.height, door.image, door.destination_zone, door.destination_x, door.destination_y);

    }

    for (let index = game.world.passages.length - 1; index > -1; -- index) {

      let passage = game.world.passages[index];

      game.world.passages[index] = new Passage(passage.x, passage.y, passage.width, passage.height, passage.destination_zone, passage.destination_x, passage.destination_y);

    }

    game.player.velocity_x = 0;

  }

};

////////////////////
//// INITIALIZE ////
////////////////////

display.buffer.canvas.width = 18*SPRITE_SIZE/3; //This will be the virtual width of the display = 360
display.buffer.canvas.height = 9*SPRITE_SIZE/3; //This will be the virtual height of the display = 180

////////////////////////////////////////////////////////////////////////////////////////////////////
////////// Check if we are in a touch enabled device //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
var touchscreen = false;
var touch_sz = 1;

if ('ontouchstart' in document.documentElement) {
  touch_sz = 1.4;
  touchscreen = true;
}

// touch_sz = 1.4;
// touchscreen = true;

window.addEventListener("resize", display.resize);

window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);

// setting passive:false allows you to use preventDefault in event listeners:
display.context.canvas.addEventListener("touchend", controller.touchEnd, {passive:false});
display.context.canvas.addEventListener("touchmove", controller.touchMove, {passive:false});
display.context.canvas.addEventListener("touchstart", controller.touchStart, {passive:false});

display.resize();

////////////////////////////////////////////////////////////////////////////////////////////////////
////////// Create the array that contains the images of the game and populate the arrays //////////
//////////////////////////////////////////////////////////////////////////////////////////////////
var background_num = 5;
var background = new Array();
var check_loading = new Array();

for (var i = 0; i < background_num; i++) {
  background[i] = new Image;
  check_loading[i] = false;
}

var door_num = 4;
var door_image = new Array();
var check_door_loading = new Array();

for (var i = 0; i < door_num; i++) {
  door_image[i] = new Image;
  check_door_loading[i] = false;
}

var orb = new Image();
var obstacles_image = new Image();
var background_loaded = [false];
var player_loaded = [false];
var door_loaded = [false];
var orb_loaded = [false];

////////////////////////////////////////////////////////////////////////////
////////// Function to Load the images and start the game    //////////////
//////////////////////////////////////////////////////////////////////////

var load = function(type,index,check_array,loaded_flag) {
  type[index].addEventListener("load", function(event) {// When the load event fires, do this:
    game.loadArea("levels/karakura/zone00.json", function() {
      game.reset();
    });// Start the game loop.
    check_array[index] = true;
    loaded_flag[0] = check_loading.every(function(check) {return check;});
  });

}

/////////////////////////////////////////////////////
////////// Loading the backgrounds    //////////////
///////////////////////////////////////////////////

for (var i = 0; i < background_num; i++) {
  load(background,i,check_loading,background_loaded)
}

/////////////////////////////////////////////////////
////////// Loading the doors    ////////////////////
///////////////////////////////////////////////////

for (var i = 0; i < door_num; i++) {
  load(door_image,i,check_door_loading,door_loaded)
}


orb.addEventListener("load", function(event) {// When the load event fires, do this:
  game.loadArea("levels/karakura/zone00.json", function() {
    game.reset();
  });// Start the game loop.
  orb_loaded = true;
});

obstacles_image.addEventListener("load", function(event) {// When the load event fires, do this:
  game.loadArea("levels/karakura/zone00.json", function() {
    game.reset();
  });// Start the game loop.
  orb_loaded = true;
});


display.sprite_sheet.image.addEventListener("load", function(event) {
  game.loadArea("levels/karakura/zone00.json", function() {
    game.reset();
  });
});

/////////////////////////////////////////////////////
////////// The paths to the image files ////////////
///////////////////////////////////////////////////


display.sprite_sheet.image.src = "characters/ichigo_move_form_1.png";// Start loading the image.

background[0].src="backgrounds/karakura.jpg";
background[1].src="backgrounds/dangai.jpg";
background[2].src="backgrounds/soulsociety.jpg";
background[3].src="backgrounds/huecomundo.jpg";
background[4].src="backgrounds/lasnoches.jpg";

orb.src="objects/collect/reiryoku_orb.png";

door_image[0].src="objects/doors/senkaimon.png";
door_image[1].src="objects/doors/garganta.png";
door_image[2].src="objects/doors/lasnoches.png";
door_image[3].src="objects/doors/lasnoches_wall.png";

obstacles_image.src="objects/obstacles/obstacles_all.png"

})();
