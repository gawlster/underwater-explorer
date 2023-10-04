var canvas;
var gl;

var program;

var near = 1;
var far = 100;

var left = -6.0;
var right = 6.0;
var ytop = 6.0;
var bottom = -6.0;

var lightPosition2 = vec4(100.0, 100.0, 100.0, 1.0);
var lightPosition = vec4(0.0, 0.0, 100.0, 1.0);

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialShininess = 30.0;

var ambientColor, diffuseColor, specularColor;

var modelMatrix, viewMatrix, modelViewMatrix, projectionMatrix, normalMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, normalMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var RX = 0;
var RY = 0;
var RZ = 0;

var MS = []; // The modeling matrix stack
var TIME = 0.0; // Realtime
var dt = 0.0;
var prevTime = 0.0;
var resetTimerFlag = true;
var animFlag = false;
var controller;

let fishRotation = 0;

// Setting the colour which is needed during illumination of a surface
function setColor(c) {
  ambientProduct = mult(lightAmbient, c);
  diffuseProduct = mult(lightDiffuse, c);
  specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct),
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct),
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct),
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition),
  );
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.5, 0.5, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  setColor(materialDiffuse);

  // Initialize some shapes, note that the curved ones are procedural which allows you to parameterize how nice they look
  // Those number will correspond to how many sides are used to "estimate" a curved surface. More = smoother
  Cube.init(program);
  Cylinder.init(20, program);
  Cone.init(20, program);
  Sphere.init(36, program);

  // Matrix uniforms
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  normalMatrixLoc = gl.getUniformLocation(program, "normalMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

  // Lighting Uniforms
  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct),
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct),
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct),
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition),
  );
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

  document.getElementById("animToggleButton").onclick = function () {
    if (animFlag) {
      animFlag = false;
    } else {
      animFlag = true;
      resetTimerFlag = true;
      window.requestAnimFrame(render);
    }

    controller = new CameraController(canvas);
    controller.onchange = function (xRot, yRot) {
      RX = xRot;
      RY = yRot;
      window.requestAnimFrame(render);
    };
  };

  render(0);
};

// Sets the modelview and normal matrix in the shaders
function setMV() {
  modelViewMatrix = mult(viewMatrix, modelMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  normalMatrix = inverseTranspose(modelViewMatrix);
  gl.uniformMatrix4fv(normalMatrixLoc, false, flatten(normalMatrix));
}

// Sets the projection, modelview and normal matrix in the shaders
function setAllMatrices() {
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
  setMV();
}

// Draws a 2x2x2 cube center at the origin
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCube() {
  setMV();
  Cube.draw();
}

// Draws a sphere centered at the origin of radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawSphere() {
  setMV();
  Sphere.draw();
}

// Draws a cylinder along z of height 1 centered at the origin
// and radius 0.5.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCylinder() {
  setMV();
  Cylinder.draw();
}

// Draws a cone along z of height 1 centered at the origin
// and base radius 1.0.
// Sets the modelview matrix and the normal matrix of the global program
// Sets the attributes and calls draw arrays
function drawCone() {
  setMV();
  Cone.draw();
}

// Post multiples the modelview matrix with a translation matrix
// and replaces the modeling matrix with the result
function gTranslate(x, y, z) {
  modelMatrix = mult(modelMatrix, translate([x, y, z]));
}

// Post multiples the modelview matrix with a rotation matrix
// and replaces the modeling matrix with the result
function gRotate(theta, x, y, z) {
  modelMatrix = mult(modelMatrix, rotate(theta, [x, y, z]));
}

// Post multiples the modelview matrix with a scaling matrix
// and replaces the modeling matrix with the result
function gScale(sx, sy, sz) {
  modelMatrix = mult(modelMatrix, scale(sx, sy, sz));
}

// Pops MS and stores the result as the current modelMatrix
function gPop() {
  modelMatrix = MS.pop();
}

// pushes the current modelViewMatrix in the stack MS
function gPush() {
  MS.push(modelMatrix);
}

const ground = new Ground();
const rocks = new Rocks();
const seaweed = new Seaweed({
  length: 10,
  swaySpeed: 1,
  rotationRandomnessScale: 0.5,
  amplitude: 0.5,
  strandSize: 1,
});
const fish = new Fish({ tailFlappingSpeed: 1 });
const diver = new Diver({
  rotation: 25,
  kickingSpeed: 5,
  bubbleFrequency: 0.5,
});
const bubbles = [];
const currentBubbleGroup = [];

let lastBubbleGroupTime = 0;
let bubbleGroupOffset = 2;
let bubbleFrequency = 1;

function render(timestamp) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  eye = vec3(0, 0, 10);
  MS = [];
  modelMatrix = mat4();
  viewMatrix = lookAt(eye, at, up);
  projectionMatrix = ortho(left, right, bottom, ytop, near, far);
  setAllMatrices();

  dt = (timestamp - prevTime) / 1000;
  prevTime = timestamp;

  const diverTranslations = [
    8 + Math.cos(timestamp * 0.0008) / 2,
    Math.cos(timestamp * 0.0005) / 2,
    0,
  ];

  if (
    lastBubbleGroupTime + bubbleGroupOffset <= timestamp &&
    !currentBubbleGroup.length
  ) {
    for (let i = 1; i < Math.random() * 5; i++) {
      currentBubbleGroup.push({ startTime: timestamp + i * 300 });
    }
  }

  if (
    currentBubbleGroup.length &&
    currentBubbleGroup[0].startTime <= timestamp
  ) {
    bubbles.push(
      new Bubble({
        startingTimestamp: timestamp,
        startingCoordinates: [...diverTranslations],
        headOffset: diver.getHeadOffset(),
        bubbleSpeed: 1,
      }),
    );

    currentBubbleGroup.shift();

    if (!currentBubbleGroup.length) {
      lastBubbleGroupTime = timestamp;
      bubbleGroupOffset = getBubbleGroupOffset();
    }
  }

  gPush();
  gTranslate(0, -5, 0);
  gScale(6, 1.5, 0.5);
  ground.draw();
  gPop();

  gPush();
  gTranslate(0, -3, 0);
  gScale(0.5, 0.5, 0.5);
  rocks.drawDefaultRockPair(dt, timestamp);
  gPop();

  gPush();
  gTranslate(0, -2.5, -1);
  seaweed.draw(dt, timestamp);
  {
    gPush();
    gTranslate(-0.75, -0.5, 0);
    seaweed.draw(dt, timestamp);
    gPop();
  }
  {
    gPush();
    gTranslate(0.7, -1, 0);
    seaweed.draw(dt, timestamp);
    gPop();
  }
  gPop();

  gPush();
  gTranslate(0, Math.cos(timestamp * 0.001) / 2, 0);
  {
    gPush();
    gRotate(fishRotation, 0, 1, 0);
    gScale(0.4, 0.4, 0.4);
    gTranslate(5, -2, 0);
    fish.draw(dt, timestamp);
    fishRotation = fishRotation - (45 * dt) / 2;
    gPop();
  }
  gPop();

  gPush();
  gScale(0.5, 0.5, 0.5);
  {
    gPush();
    gTranslate(
      diverTranslations[0],
      diverTranslations[1],
      diverTranslations[2],
    );
    diver.draw(dt, timestamp);
    gPop();
  }
  {
    gPush();
    bubbles.forEach((bubble) => {
      bubble.draw(timestamp);
    });
    gPop();
  }
  gPop();

  window.requestAnimFrame(render);
}

function getBubbleGroupOffset() {
  return ((1000 * Math.random()) / bubbleFrequency) * 4;
}

// A simple camera controller which uses an HTML element as the event
// source for constructing a view matrix. Assign an "onchange"
// function to the controller as follows to receive the updated X and
// Y angles for the camera:
//
//   var controller = new CameraController(canvas);
//   controller.onchange = function(xRot, yRot) { ... };
//
// The view matrix is computed elsewhere.
function CameraController(element) {
  var controller = this;
  this.onchange = null;
  this.xRot = 0;
  this.yRot = 0;
  this.scaleFactor = 3.0;
  this.dragging = false;
  this.curX = 0;
  this.curY = 0;

  // Assign a mouse down handler to the HTML element.
  element.onmousedown = function (ev) {
    controller.dragging = true;
    controller.curX = ev.clientX;
    controller.curY = ev.clientY;
  };

  // Assign a mouse up handler to the HTML element.
  element.onmouseup = function (ev) {
    controller.dragging = false;
  };

  // Assign a mouse move handler to the HTML element.
  element.onmousemove = function (ev) {
    if (controller.dragging) {
      // Determine how far we have moved since the last mouse move
      // event.
      var curX = ev.clientX;
      var curY = ev.clientY;
      var deltaX = (controller.curX - curX) / controller.scaleFactor;
      var deltaY = (controller.curY - curY) / controller.scaleFactor;
      controller.curX = curX;
      controller.curY = curY;
      // Update the X and Y rotation angles based on the mouse motion.
      controller.yRot = (controller.yRot + deltaX) % 360;
      controller.xRot = controller.xRot + deltaY;
      // Clamp the X rotation to prevent the camera from going upside
      // down.
      if (controller.xRot < -90) {
        controller.xRot = -90;
      } else if (controller.xRot > 90) {
        controller.xRot = 90;
      }
      // Send the onchange event to any listener.
      if (controller.onchange != null) {
        controller.onchange(controller.xRot, controller.yRot);
      }
    }
  };
}
