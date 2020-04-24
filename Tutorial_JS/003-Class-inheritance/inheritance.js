

function Human(name,age) {

  this.name = name;
  this.age = age;

}

function Worker(name, job, age) {

  Human.call(this, name, age);

  this.job = job;

}

var human = new Human("Rodrigo",10);
var worker = new Worker("Borba","Engineer",20);


console.log(human.name + human.age);
console.log(worker.name + ", " + worker.job + worker.age);
