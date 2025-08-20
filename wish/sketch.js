// Most of this is by Daniel Shiffman
// http://codingtra.in

let confettiColor = [],
  confetti = [];
var font;
var vehicles = [];
var imgVehicles = [];

var mainNames = ["U3VzaG1pdGhh", "U2Fp", "U3dlZXRpZQ=="];
var texts = ["Happy", "Birthday", "Sunita", "Oops,Sorry!!"];
var finalTexts = [];

var nextT = 0;
var maxChangeForce = 17;
let timer = 500;
let wordDelay = 4000;

let img;

function preload() {
  font = loadFont("Jaapokki-Regular.otf");
}

function param(k, defaultFn = () => err()) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.has(k) ? searchParams.get(k) : defaultFn();
}

function setup() {
  if (width < 500) {
    // mobile screens
    frameRate(24);
    pixelDensity(1);
    timer = 5000;
    wordDelay = 8000;
    texts = finalTexts;
  }

  let newMainNames = [];
  mainNames.forEach((mainName) => {
    newMainName = atob(mainName);
    finalTexts.push("Happy", "Birthday", newMainName);
    newMainNames.push(newMainName);
  });
  mainNames = newMainNames;
  texts.push(mainNames[0]);

  const key = param("k", () => "_foo_");
  if (!isValidKey(key)) {
    window.location.href =
      "https://www.google.com/search?q=happy+birthday+stranger";
    return;
  }

  const imgData = getImgData(key);
  const imgW = imgData.width;
  const imgH = imgData.height;
  const imgPixels = imgData.pixels;
  const pixelSpace = 10;

  createCanvas(windowWidth, windowHeight);
  background("#D1D5DB");

  var bounds = font.textBounds(texts[nextT], 0, 0, 192);
  var posx = width / 2 - bounds.w / 2;
  var posy = height / 2 + bounds.h / 2;

  var points = font.textToPoints(texts[nextT], posx, posy + 200, 192, {
    sampleFactor: 0.1,
  });

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y, 8);
    vehicles.push(vehicle);
  }
  var imgXoffset = width / 2 - imgW / 2;
  var imgYoffset = height >= imgH ? height / 2 - imgH / 2 : 0;
  for (let col = 0; col < imgPixels[0].length; col++) {
    for (let row = 0; row < imgPixels.length; row++) {
      let c = imgPixels[row][col];
      var imgVehicle = new Vehicle(
        col * pixelSpace + imgXoffset,
        row * pixelSpace + imgYoffset,
        10,
        c[0],
        c[1],
        c[2]
      );
      imgVehicles.push(imgVehicle);
    }
  }
}

function draw() {
  background(51);

  for (var i = 0; i < imgVehicles.length; i++) {
    var v = imgVehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }

  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }

  if (millis() >= wordDelay + timer) {
    nextWord();
    timer = millis();
  }
}

function nextWord() {
  //print("next word");
  nextT++;
  if (nextT > texts.length - 1) {
    nextT = 0;
    texts = finalTexts;
  }

  var bounds = font.textBounds(texts[nextT], 0, 0, 192);
  var posx = width / 2 - bounds.w / 2;
  var posy = height / 2 + bounds.h / 2;

  var points = font.textToPoints(texts[nextT], posx, posy + 200, 192, {
    sampleFactor: 0.1,
  });

  if (points.length < vehicles.length) {
    var toSplice = vehicles.length - points.length;
    vehicles.splice(points.length - 1, toSplice);

    for (var i = 0; i < points.length; i++) {
      vehicles[i].target.x = points[i].x;
      vehicles[i].target.y = points[i].y;

      var force = p5.Vector.random2D();
      force.mult(random(maxChangeForce));
      vehicles[i].applyForce(force);
    }
  } else if (points.length > vehicles.length) {
    for (var i = vehicles.length; i < points.length; i++) {
      var v = vehicles[i - vehicles.length].clone();

      vehicles.push(v);
    }

    for (var i = 0; i < points.length; i++) {
      vehicles[i].target.x = points[i].x;
      vehicles[i].target.y = points[i].y;

      var force = p5.Vector.random2D();
      force.mult(random(maxChangeForce));
      vehicles[i].applyForce(force);
    }
  } else {
    for (var i = 0; i < points.length; i++) {
      vehicles[i].target.x = points[i].x;
      vehicles[i].target.y = points[i].y;

      var force = p5.Vector.random2D();
      force.mult(random(maxChangeForce));
      vehicles[i].applyForce(force);
    }
  }
}
