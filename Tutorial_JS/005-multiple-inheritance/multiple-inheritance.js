

function Human(name) {

  this.name = name;

};

Human.prototype = {

  talk:function() {

    console.log("Shut up, stupid " + this.name);

  }
};

function Worker(job) {

  this.job = job;

};

Worker.prototype = {

  work:function() {

    console.log("I'm an " + this.job);

  }
};

function Borba(job){

  Human.call(this,"Borba");
  Worker.call(this,job);

}

// Create a prototype
Borba.prototype=Object.create(Human.prototype);

// Add the new code to the existing Borba.prototype
Object.assign(Borba.prototype, Worker.prototype);

var borba = new Borba("Image processing engineer");
borba.talk();
borba.work();
