"use strict";

// declare namespace
var CC3D = CC3D || {};

///////////////////////////////////////////////////////////////////////////////

CC3D.Vehicle = function(board, scene) {

  this.cameraView = 3;
  this.board = board;

  var materialArray = [];
  materialArray.push(new THREE.MeshBasicMaterial({color: 0x000000}));
  materialArray.push(new THREE.MeshBasicMaterial({color: 0x000000}));
  materialArray.push(new THREE.MeshBasicMaterial({color: 0x000000}));
  materialArray.push(new THREE.MeshBasicMaterial({color: 0x848484}));
  materialArray.push(new THREE.MeshBasicMaterial({color: 0x848484}));
  materialArray.push(new THREE.MeshBasicMaterial({color: 0x848484}));

  var VehicleMeshMat = new THREE.MeshFaceMaterial(materialArray);
  var VehicleMeshGeom = new THREE.CubeGeometry(VEHICLE_WIDTH, VEHICLE_HEIGHT, VEHICLE_LENGTH, 1, 1, 1, materialArray);

  this.vehicleMesh = new THREE.Mesh(VehicleMeshGeom, VehicleMeshMat);
  this.vehicleMesh.position = board.boardPosForTile(1, 1, VEHICLE_HEIGHT);

  scene.add(this.vehicleMesh);

  // State variables
  this.speed = 0;
  this.currentTile = {
    x: 1,
    y: 1
  };
  this.direction = DIRECTION_N;
  this.tweening = false;

  //move to separate turn class?
  this.rotateValue = 0;
  this.rotateValueRemaining = 0;
  this.directions = [];
  this.initDirections();

  //move to car_controls?
  this.newTurn = TURN_NONE;
  this.changeSpeedAttempts = []
};

CC3D.Vehicle.prototype.changeSpeedAttempt = function(newSpeed) {
  if (this.changeSpeedAttempts.length < 3) {
    this.changeSpeedAttempts.push(newSpeed);
  }
};

CC3D.Vehicle.prototype.checkChangeSpeed = function() {
  if (this.changeSpeedAttempts.length == 0) {
    return;
  }

  var that = this;
  this.changeSpeedAttempts.forEach(function(speedChange) {
    that.speed += speedChange;
  })
  this.changeSpeedAttempts = [];
  if (this.speed < 0) {
    this.speed = 0
  }
  if (this.speed > 3) {
    this.speed = 3
  }

  this.speedChangedListener.speedChanged(this.speed)

  //console.log("speed changed, now "+this.speed)
}

CC3D.Vehicle.prototype.addSpeedChangedListener = function(listener) {
  this.speedChangedListener = listener;
};

CC3D.Vehicle.prototype.initDirections = function() {

  var that = this;
  [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  ].forEach(function(i) {
    var r = {
      x: that.vehicleMesh.rotation.x,
      y: that.vehicleMesh.rotation.y,
      z: that.vehicleMesh.rotation.z
    };
    that.directions[i] = r;
    that.vehicleMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -(Math.PI / 4));
  })

};

CC3D.Vehicle.prototype.updateTurning = function(delta) {
  if (this.rotateValueRemaining > 0) {
    if (this.rotateValueRemaining < -1) {
      this.vehicleMesh.rotation.x = this.directions[this.direction].x;
      this.vehicleMesh.rotation.y = this.directions[this.direction].y;
      this.vehicleMesh.rotation.z = this.directions[this.direction].z;
      this.rotateValueRemaining = this.rotateValue = 0;
      console.log("direction corrected");
    } else {
      var current = this.rotateValue * (delta * 2); // pi/2 radians (90 degrees) per second
      this.vehicleMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), current);
      this.rotateValueRemaining -= Math.abs(current);
    }
  }
};

CC3D.Vehicle.prototype.update = function(delta) {

  if (this.speed > 0) {
    this.updateTurning(delta);
  }

  TWEEN.update();
  if (!this.tweening) {
    this.checkChangeSpeed();

    if (this.speed > 0) {
      this.tweenTile();
    }
  }
};

CC3D.Vehicle.prototype.right = function() {
  this.newTurn = TURN_RIGHT;
};

CC3D.Vehicle.prototype.left = function() {
  this.newTurn = TURN_LEFT;
};

CC3D.Vehicle.prototype.doTurn = function() {

  if (this.newTurn === TURN_NONE)
    return;
  if (this.newTurn === TURN_LEFT) {
    this.rotateValue = (Math.PI / 4);
    this.updateDirection(-1);
  } else {
    this.rotateValue = -(Math.PI / 4);
    this.updateDirection(1);
  }
  this.rotateValueRemaining = Math.abs(this.rotateValue);

  this.newTurn = TURN_NONE;
};

CC3D.Vehicle.prototype.updateDirection180 = function() {
  this.updateDirection(4);
};

CC3D.Vehicle.prototype.updateDirection = function(changeValue) {
  this.direction = this.board.getUpdatedDirection(this.direction, changeValue);
};

CC3D.Vehicle.prototype.tweenTile = function() {
  this.tweening = true;
  console.log("tweenTile: " + this.currentTile.x + ", " + this.currentTile.y);
  //TWEEN.removeAll();
  // if(this.board.isCollision(this.currentTile, this.direction)){
  // 	this.newSpeed = false;
  // 	this.speed = 0;
  // 	this.stopDrive();

  // 	return;
  // }

  this.nextTile = this.board.nextTile(this.currentTile, this.direction);
  var positionVector = this.board.boardPosForTile(this.currentTile.x, this.currentTile.y, VEHICLE_HEIGHT);
  var targetVector = this.board.boardPosForTile(this.nextTile.x, this.nextTile.y, VEHICLE_HEIGHT);

  var position = {
    x: positionVector.x,
    y: positionVector.z
  };
  var target = {
    x: targetVector.x,
    y: targetVector.z
  };

  console.log("position.y " + position.y)
  console.log("position.x " + position.x)

  var that = this;
  var tweenUpdate = function() {
    that.vehicleMesh.position.z = position.y;
    that.vehicleMesh.position.x = position.x;
  };

  var tweenComplete = function() {
    console.log("tweenComplete");

    that.currentTile = that.nextTile;
    that.doTurn();

    that.tweening = false;
  };

  var tween = new TWEEN.Tween(position).to(target, SPEED[this.speed]).onUpdate(tweenUpdate).onComplete(tweenComplete).start();
};

CC3D.Vehicle.prototype.topView = function(camera) {
  //Top View
  var relativeCameraOffset = new THREE.Vector3(0, 1300, 20);
  var cameraOffset = relativeCameraOffset.applyMatrix4(this.vehicleMesh.matrixWorld);

  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  camera.lookAt(this.vehicleMesh.position);
};

CC3D.Vehicle.prototype.topBehindView = function(camera) {
  var relativeCameraOffset = new THREE.Vector3(0, 30, 100);
  var cameraOffset = relativeCameraOffset.applyMatrix4(this.vehicleMesh.matrixWorld);

  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  var frontOfVehicle = new THREE.Vector3(0, 10, -100);
  frontOfVehicle.applyMatrix4(this.vehicleMesh.matrixWorld);
  camera.lookAt(frontOfVehicle);
};

CC3D.Vehicle.prototype.driverView = function(camera) {
  var relativeCameraOffset = new THREE.Vector3(0, 4, 0);
  var cameraOffset = relativeCameraOffset.applyMatrix4(this.vehicleMesh.matrixWorld);

  camera.position.x = cameraOffset.x;
  camera.position.y = cameraOffset.y;
  camera.position.z = cameraOffset.z;

  var frontOfVehicle = new THREE.Vector3(0, 6, -10);
  frontOfVehicle.applyMatrix4(this.vehicleMesh.matrixWorld);
  camera.lookAt(frontOfVehicle);
};

CC3D.Vehicle.prototype.updateCamera = function(camera) {

  switch (this.cameraView) {
    case 1:
      this.driverView(camera);
      break;
    case 2:
      this.topBehindView(camera);
      break;
    case 3:
      this.topView(camera);
      break;
  }
};
