"use strict";

// declare namespace
var CC3D = CC3D || {};

///////////////////////////////////////////////////////////////////////////////

var createMatrix = function(columns, rows) {
  var matrix = [];

  for (var i = 0; i < columns; i++) {
    matrix[i] = [];
    for (var j = 0; j < rows; j++) {
      matrix[i][j] = 0;
    }
  }

  return matrix;
};


CC3D.Board = function() {
  this.tiles = createMatrix(100, 100);
};

CC3D.Board.prototype.toString = function() {
  return "Board";
};

CC3D.Board.prototype.addBuilding = function(building, x, y) {
  building.position = this.boardPosForTile(x, y, 20);
  this.tiles[x][y] = 1;
};

CC3D.Board.prototype.isBuilding = function(tile) {
  if (this.tiles[tile.x][tile.y] !== 0) {
    return true;
  } else {
    return false;
  }
};

var createFloorLine = function(from, to){
  var lineGeometry = new THREE.Geometry();
  var vertArray = lineGeometry.vertices;
  vertArray.push(from, to);
  lineGeometry.computeLineDistances();
  var lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
  var line = new THREE.Line(lineGeometry, lineMaterial);
  return line;
};


CC3D.Board.prototype.drawFloorPattern = function(scene) {
  var lineGeometry;
  var vertArray;
  var lineMaterial;
  var line;


  for (var z = -525; z <= 525; z += TILE_SIZE) {

    // left to right
    scene.add(createFloorLine(new THREE.Vector3(-525, 0, z), new THREE.Vector3(525, 0, z)));

    // top to bottom
    scene.add(createFloorLine(new THREE.Vector3(z, 0, 525), new THREE.Vector3(z, 0, -525)));
  }

  for (z = -525; z < 525; z += TILE_SIZE) {

    // cross top to bottom
    scene.add(createFloorLine(new THREE.Vector3(-z, 0, 525), new THREE.Vector3(-525, 0, z)));

    // cross right to left
    scene.add(createFloorLine(new THREE.Vector3(525, 0, -z), new THREE.Vector3(z, 0, -525)));

    // cross bottom to top
    scene.add(createFloorLine(new THREE.Vector3(z, 0, 525), new THREE.Vector3(525, 0, z)));

    // cross left to right
    scene.add(createFloorLine(new THREE.Vector3(-525, 0, z), new THREE.Vector3(z, 0, -525)));
  }
};

CC3D.Board.prototype.boardPosForTile = function(x, y, objectY) {

  //starts left, bottom corner
  //offset
  var offsetX = -525;
  var offsetY = 525;
  //20,20

  return new THREE.Vector3(offsetX + (x * TILE_SIZE), objectY, offsetY - (y * TILE_SIZE));
};

CC3D.Board.prototype.isCollision = function(currentTile, direction) {
  var nextTile = this.nextTile(currentTile, direction);
  var nextTileLeft = this.nextTile(currentTile, this.getUpdatedDirection(direction, -1));
  var nextTileRight = this.nextTile(currentTile, this.getUpdatedDirection(direction, + 1));

  return this.isBuilding(nextTile) || this.isBuilding(nextTileLeft) || this.isBuilding(nextTileRight);
};

CC3D.Board.prototype.getUpdatedDirection = function(direction, modifier) {
  var newDirection = direction + modifier;
  if (newDirection < 0) {
    newDirection += 8;
  } else if (newDirection > 7) {
    newDirection -= 8;
  }

  return newDirection;
};

CC3D.Board.prototype.nextTile = function(currentTile, direction) {
  var nextTile = {
    x: currentTile.x,
    y: currentTile.y
  };

  switch (direction) {
    case DIRECTION_N:
      nextTile.y += 1;
      break;
    case DIRECTION_NE:
      nextTile.y += 1;
      nextTile.x += 1;
      break;
    case DIRECTION_E:
      nextTile.x += 1;
      break;
    case DIRECTION_SE:
      nextTile.y -= 1;
      nextTile.x += 1;
      break;
    case DIRECTION_S:
      nextTile.y -= 1;
      break;
    case DIRECTION_SW:
      nextTile.y -= 1;
      nextTile.x -= 1;
      break;
    case DIRECTION_W:
      nextTile.x -= 1;
      break;
    case DIRECTION_NW:
      nextTile.y += 1;
      nextTile.x -= 1;
      break;
    default:
      console.log("Error, direction not matching " + direction);
  }

  return nextTile;
};
