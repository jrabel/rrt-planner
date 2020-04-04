var container = document.getElementById('container');
var camera, controls, scene, renderer;
var clock = new THREE.Clock();
var terrainGenerator;

var collisionDetector;

var boxes = [];

init();
animate();

function init() {

    var height = 20;
    var width = 20;
    var cellSize = 1;

    createScene();
    createCamera(height, width);
    createRenderer();
    createControls(height, width);
    createLights(height, width);

    window.addEventListener('resize', onWindowResize, false);

    var startCell = { x: 1, y: 1 };
    var goalCell = { x: height - 2, y: width - 2 };
    var occupancyGrid = new OccupancyGrid(height, width, cellSize, startCell, goalCell);
    occupancyGrid.drawObstacles(scene);
    // render to update obstacle mesh positions
    render();

    collisionDetector = new CollisionDetector(occupancyGrid.obstaclesArray);

    var start = {
        x: startCell.x * cellSize,
        y: startCell.y * cellSize
    };
    var goal = {
        x: goalCell.x * cellSize,
        y: goalCell.y * cellSize
    };

    var robotSize = cellSize / 2;
    var robot = new Robot(start.x, start.y, 0, robotSize);
    robot.drawRobot(scene);

    var limits = {
        x: [0, (height - 1) * cellSize],
        y: [0, (width - 1) * cellSize]
    };

    var planner = new RRT(start, goal, limits, collisionDetector);
    planner.drawRRT(scene);
}

function createScene() {
    scene = new THREE.Scene();
    var backgroundColor = 0xFFFFFF;
    scene.background = new THREE.Color(backgroundColor);
}

function createCamera(height, width) {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.x = width / 2;
    camera.position.y = height / 2;
    camera.position.z = 30;
    camera.up = new THREE.Vector3(0, 0, 1);
}

function createControls(height, width) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(width / 2, height / 2, 0);
    camera.lookAt(width / 2, height / 2, 0);
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
}

function createLights(height, width) {
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    var hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 2);
    hemisphereLight.position.x = width / 2;
    hemisphereLight.position.y = height / 2;
    hemisphereLight.position.z = 30;
    scene.add(hemisphereLight);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    // controls.update(clock.getDelta());
    renderer.render(scene, camera);
}