
var lesson5 = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    controls: null,
    clock: null,
    stats: null,

    init: function() { // Initialization

        // create main scene
        this.scene = new THREE.Scene();

        var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight;

        // prepare camera
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.position.set(0, 30, 150);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        // prepare renderer
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.setClearColor(0xffffff);

        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;

        // prepare container
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);

        // events
        THREEx.WindowResize(this.renderer, this.camera);

        // prepare controls (OrbitControls)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.maxDistance = 700;

        // prepare clock
        this.clock = new THREE.Clock();

        // prepare stats
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '50px';
        this.stats.domElement.style.bottom = '50px';
        this.stats.domElement.style.zIndex = 1;
        this.container.appendChild( this.stats.domElement );

        // add point light
        var spLight = new THREE.PointLight(0xffffff, 1.75, 1000);
        spLight.position.set(-100, 200, 200);
        this.scene.add(spLight);

        // add simple cube
        var cube = new THREE.Mesh( new THREE.CubeGeometry(50, 10, 50), new THREE.MeshLambertMaterial({color:0xffffff * Math.random()}) );
        cube.position.set(0, 0, 0);
        this.scene.add(cube);

        // add custom objects
        //drawShaderSkybox: function() {

        // prepare ShaderMaterial without textures
        var vertexShader = document.getElementById('sky-vertex').textContent, fragmentShader = document.getElementById('sky-fragment').textContent;
        var uniforms = {
            topColor: {type: "c", value: new THREE.Color(0x0055ff)}, bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
            offset: {type: "f", value: 50}, exponent: {type: "f", value: 0.6}
        }
        var skyMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide, fog: false});

        // create Mesh with sphere geometry and add to the scene
        var skyBox = new THREE.Mesh( new THREE.SphereGeometry(250, 60, 40), skyMaterial);

        this.scene.add(skyBox);
    //}

    }
};

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

// Update controls and stats
function update() {
    lesson5.controls.update(lesson5.clock.getDelta());
    lesson5.stats.update();
}

// Render the scene
function render() {
    if (lesson5.renderer) {
        lesson5.renderer.render(lesson5.scene, lesson5.camera);
    }
}

// Initialize lesson on page load
function initializeLesson() {
    lesson5.init();
    animate();
}

if (window.addEventListener)
    window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
    window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
