"use strict";
document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  switch (e.keyCode) {
    case 49: //1
      vehicle.cameraView = 1
      break;
    case 50: //2
      vehicle.cameraView = 2
      break;
    case 51: //3
      vehicle.cameraView = 3
      break;
    case 38: //UP ARROW
      carControls.forward();
      break;
    case 40: //DOWN ARROW
      carControls.reverse();
      break;
    case 37: //LEFT ARROW
      carControls.left();
      break;
    case 39: //RIGHT ARROW
      carControls.right();
      break;
  }
}

// MAIN

// standard global variables
var container,
  scene,
  camera,
  renderer,
  controls,
  stats,
  skyBox;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var vehicle,
  carControls,
  board;

init();
animate();

// FUNCTIONS
function init() {
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(0, 150, 400);
  camera.lookAt(scene.position);
  // RENDERER
  if (Detector.webgl)
    renderer = new THREE.WebGLRenderer({antialias: true});
  else
    renderer = new THREE.CanvasRenderer();

  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById('ThreeJS');
  container.appendChild(renderer.domElement);
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});

  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);
  //LIGHT
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0, 250, 0);
  scene.add(light);

  // add simple ground
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 10, 10), new THREE.MeshLambertMaterial({color: 0x999999}));
  ground.receiveShadow = true;
  ground.position.set(0, 0, 0);
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // SKYBOX
  var vertexShader = document.getElementById('sky-vertex').textContent,
    fragmentShader = document.getElementById('sky-fragment').textContent;
  var uniforms = {
    topColor: {
      type: "c",
      value: new THREE.Color(0x0055ff)
    },
    bottomColor: {
      type: "c",
      value: new THREE.Color(0xffffff)
    },
    offset: {
      type: "f",
      value: 50
    },
    exponent: {
      type: "f",
      value: 0.6
    }
  }
  var skyMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide, fog: false});

  // create Mesh with sphere geometry and add to the scene
  var skyBox = new THREE.Mesh(new THREE.SphereGeometry(1000, 100, 100), skyMaterial);
  scene.add(skyBox);

  // BOARD
  board = new CC3D.Board();
  board.drawFloorPattern(scene);

  // VEHICLE
  vehicle = new CC3D.Vehicle(board, scene);
  carControls = new CC3D.CarControls(vehicle);
};

function animate() {
  requestAnimationFrame(animate);
  render();
  update();

}

function update() {
  var delta = clock.getDelta(); // seconds.
  //vehicle.update(delta);
  CC3D.updateDebugInfo(vehicle, carControls);
  vehicle.updateCamera(camera);
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}
