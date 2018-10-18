"use strict";

// declare namespace
var CC3D = CC3D || {};
///////////////////////////////////////////////////////////////////////////////

CC3D.ReverseState = function(stateMachine) {
  this.stateMachine = stateMachine
};

CC3D.ReverseState.prototype.onEnter = function() {
  console.log("entering reverse state")

  this.stateMachine.controls.vehicle.updateDirection180()
  this.reverse();
};

CC3D.ReverseState.prototype.speedChanged = function(newSpeed) {
  console.log("reverse state, speedChanged")
  if (newSpeed == 0) {
    this.stateMachine.controls.vehicle.updateDirection180()
    this.stateMachine.changeState(this.stateMachine.stillState);
  }
};

CC3D.ReverseState.prototype.forward = function() {
  console.log("forward")
  this.stateMachine.controls.vehicle.changeSpeedAttempt(-1);
};

CC3D.ReverseState.prototype.reverse = function() {
  console.log("reverse")
  this.stateMachine.controls.vehicle.changeSpeedAttempt(1);
};

CC3D.ReverseState.prototype.left = function() {
  console.log("left")
  this.stateMachine.controls.vehicle.left();
};

CC3D.ReverseState.prototype.right = function() {
  console.log("right")
  this.stateMachine.controls.vehicle.right();
};

///////////////////////////////////////////////////////////////////////////////

CC3D.ForwardState = function(stateMachine) {
  this.stateMachine = stateMachine
};

CC3D.ForwardState.prototype.onEnter = function() {
  console.log("entering forward state")
  this.forward();
};

CC3D.ForwardState.prototype.speedChanged = function(newSpeed) {
  console.log("forward state, speedChanged")
  if (newSpeed == 0) {
    this.stateMachine.changeState(this.stateMachine.stillState);
  }
};

CC3D.ForwardState.prototype.forward = function() {
  console.log("forward")
  this.stateMachine.controls.vehicle.changeSpeedAttempt(1);
};

CC3D.ForwardState.prototype.reverse = function() {
  console.log("change to still state")
  this.stateMachine.controls.vehicle.changeSpeedAttempt(-1);
};

CC3D.ForwardState.prototype.left = function() {
  console.log("left")
  this.stateMachine.controls.vehicle.left()
};

CC3D.ForwardState.prototype.right = function() {
  console.log("right")
  this.stateMachine.controls.vehicle.right()

};

///////////////////////////////////////////////////////////////////////////////

CC3D.StillState = function(stateMachine) {
  this.stateMachine = stateMachine
};

CC3D.StillState.prototype.onEnter = function() {
  console.log("entering still state")

};

CC3D.StillState.prototype.speedChanged = function(newSpeed) {
  console.log("still state, speedChanged")
};

CC3D.StillState.prototype.forward = function() {
  console.log("change to forward state")
  this.stateMachine.changeState(this.stateMachine.forwardState);
};

CC3D.StillState.prototype.reverse = function() {
  console.log("change to reverse state")
  this.stateMachine.changeState(this.stateMachine.reverseState);
};

CC3D.StillState.prototype.left = function() {
  console.log("left")

};

CC3D.StillState.prototype.right = function() {
  console.log("right")

};

///////////////////////////////////////////////////////////////////////////////

CC3D.StateMachine = function(controls) {
  this.controls = controls;
  this.stillState = new CC3D.StillState(this);
  this.forwardState = new CC3D.ForwardState(this);
  this.reverseState = new CC3D.ReverseState(this);
};

CC3D.StateMachine.prototype.speedChanged = function(newSpeed) {
  this.controls.currentState.speedChanged(newSpeed);
};

CC3D.StateMachine.prototype.getState = function() {
  console.log("getState")

  return this.stillState;
};

CC3D.StateMachine.prototype.changeState = function(newState) {
  console.log("changeState")
  this.controls.currentState = newState;

  newState.onEnter();
};

///////////////////////////////////////////////////////////////////////////////

CC3D.CarControls = function(vehicle) {
  this.vehicle = vehicle;
  this.stateMachine = new CC3D.StateMachine(this);
  this.currentState = this.stateMachine.getState();
  vehicle.addSpeedChangedListener(this.stateMachine);

};

CC3D.CarControls.prototype.forward = function() {
  this.currentState.forward()
};

CC3D.CarControls.prototype.reverse = function() {
  this.currentState.reverse()
};

CC3D.CarControls.prototype.left = function() {
  this.currentState.left()
};

CC3D.CarControls.prototype.right = function() {
  this.currentState.right()
};

///////////////////////////////////////////////////////////////////////////////
