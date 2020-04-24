

function Human(name) {

  this.name = name;
  // Cannot acess inside the prototyoe
  // var myvar

}

Human.prototype = {

  constructor:Human,

  talk:function() {

    console.log("Shut up, stupid " + this.name);

  }
}

function Worker(name, job) {

  Human.call(this, name);

  this.job = job;

}

// Create exactly the same prototype as Human;
Worker.prototype = Object.create(Human.prototype);
Worker.prototype.constructor=Worker;

Worker.prototype.talk = function() {

  console.log("Don't tell me to shut up, " + this.name + ". I'm an " + this.job +" "+ this.constructor.name);

}

var human = new Human("Rodrigo");
var worker = new Worker("Borba","Engineer");

human.talk();
worker.talk();
