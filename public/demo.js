// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;
let bubbles = [];
let model;

const mixers = [];
const clock = new THREE.Clock();

function initBubbles(positions, position) {
  let numPoints = positions.length / 3;
  let step = Math.floor(numPoints / numPoints) * 3;
  let group = new THREE.Group();
  group.position.copy(position);
  for (let i = 0; i < numPoints; i++) {
    var idx = i*step;
    var pos = new THREE.Vector3( positions[idx++] ,  positions[idx++],  positions[idx] );
    
    var geometry = new THREE.SphereGeometry( 1, 8, 8 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.copy(pos);
    //scene.add( sphere );
    group.add(sphere);
  }
  scene.add(group);
  bubbles.push(group);
}

function moveBubbles() {
  for(let i = 0; i<bubbles.length; i++) {
    bubbles[i].position.z -= 1;
    //bubbles[i].scale.z *= .1;
  }
}

function resetBubbles(positions, position) {
  let numPoints = positions.length / 3;
  let step = Math.floor(numPoints / numPoints) * 3;
  for (let i = 0; i < numPoints; i++) {
    var idx = i*step;
    var pos = new THREE.Vector3( positions[idx++] + position.x,  positions[idx++]+ position.y,  positions[idx]+ position.z );
    
    bubbles[i].position.copy(pos);
  }
}

function init() {
  container = document.querySelector("#container");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8fbcd4);

  initCamera();
  initControls();
  initLights();
  loadModels();
  initRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function initCamera() {
  camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(-50, 25, 250);
}

function initControls() {
  controls = new THREE.OrbitControls(camera, container);
}

function initLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const frontLight = new THREE.DirectionalLight(0xffffff, 1);
  frontLight.position.set(10, 10, 10);

  const backLight = new THREE.DirectionalLight(0xffffff, 1);
  backLight.position.set(-10, 10, -10);

  scene.add(frontLight, backLight);
}

function loadModels() {
  const loader = new THREE.GLTFLoader();

  // A reusable function to setup the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = (gltf, position) => {
    model = gltf.scene.children[0];
    model.position.copy(position);

    const animation = gltf.animations[0];
    //animation.timeScale = 1/50 ;

    const mixer = new THREE.AnimationMixer(model);
    //mixer.timeScale = 1/50;
    mixers.push(mixer);

    const action = mixer.clipAction(animation);
    action.play();

    scene.add(model);
    
  };

  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = errorMessage => {
    console.log(errorMessage);
  };

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first
  const parrotPosition = new THREE.Vector3(0, 0, 50);
  loader.load(
    "assets/pudim3d.glb",
    gltf => onLoad(gltf, parrotPosition),
    onProgress,
    onError
  );

  // load the second model
  //const flamingoPosition = new THREE.Vector3(150, 0, -200);
  //loader.load('models/Flamingo.glb', gltf => onLoad(gltf, flamingoPosition), onProgress, onError);

  // load the third model
  //const storkPosition = new THREE.Vector3(0, -50, -200);
  //loader.load('models/Stork.glb', gltf => onLoad(gltf, storkPosition), onProgress, onError);
}

function initRenderer() {
  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  renderer.setPixelRatio(window.devicePixelRatio);

  // add the automatically created <canvas> element to the page
  container.appendChild(renderer.domElement);
}


var cnt = 0;
function update() {
  const delta = clock.getDelta();

  mixers.forEach(mixer => {
    mixer.update(delta);
  });
  
  /*moveBubbles();
  if(cnt++ > 5 && model !== undefined && bubbles.length < 10) {
    cnt = 0;
    initBubbles(model.geometry.attributes.position.array, model.position);
  }*/
}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);

init();
