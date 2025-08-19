// Modified from Daniel Shiffman's code
// http://codingtra.in
// Steering Text Paths

function Vehicle(x, y, size, cR, cG, cB) {
  this.pos = createVector(random(width), random(height));
  this.target = createVector(x, y);
  this.vel = p5.Vector.random2D();
  this.acc = createVector();
  if (size != null) {
    this.r = size;
  } else {
    this.r = 8;
  }
  if ((cR, cG, cB != null)) {
    this.col = color(cR, cG, cB);
  } else {
    this.col = color(255, 0, 0);
  }
  this.maxspeed = 10;
  this.maxforce = 1;
}

Vehicle.prototype.behaviors = function () {
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  arrive.mult(1);
  flee.mult(5);

  this.applyForce(arrive);
  this.applyForce(flee);
};

Vehicle.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Vehicle.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Vehicle.prototype.show = function () {
  stroke(255);
  strokeWeight(this.r);
  stroke(this.col);
  point(this.pos.x, this.pos.y);
};

Vehicle.prototype.arrive = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
};

Vehicle.prototype.flee = function (target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Vehicle.prototype.clone = function () {
  var v = new Vehicle(
    this.pos.x,
    this.pos.y,
    this.size,
    this.cR,
    this.cG,
    this.cB
  );

  v.pos.x = this.pos.x;
  v.pos.y = this.pos.y;

  v.vel.x = this.vel.x;
  v.vel.y = this.vel.y;

  v.acc.x = this.acc.x;
  v.acc.y = this.acc.y;

  v.cR = this.cR;
  v.cG = this.cG;
  v.cB = this.cB;

  return v;
};
