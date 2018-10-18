// declare namespace
var CC3D = CC3D || {};

///////////////////////////////////////////////////////////////////////////////

CC3D.updateDebugInfo = function(vehicle, carControls) {
  // DEBUG

  var text = 'Speed: ' + vehicle.speed;
  // text = text+'<br>Direction: '+vehicle.driving.direction;
  // text = text+'<br>Drive State: '+vehicle.driving.current;
  // text = text+'<br>Current Tile: ['+vehicle.driving.currentTile.x +', '+vehicle.driving.currentTile.y + ']';

  text = text + '<br>changeSpeedAttempts' + vehicle.changeSpeedAttempts;
  var debugInfo = document.createElement('div');
  debugInfo.style.position = 'absolute';
  debugInfo.innerHTML = text;
  debugInfo.style.backgroundColor = 'white';
  debugInfo.style.borderRadius = "5px";
  debugInfo.style.padding = "0px 20px";
  debugInfo.style.left = "10px";
  debugInfo.style.top = "10px";
  document.body.appendChild(debugInfo);

}
