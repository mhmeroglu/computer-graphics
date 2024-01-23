//-------------------------------------------------
// Title:
// Author: Mehmet Eroğlu / Bedirhan Demir
// ID: 37177526200 / 40381614816
// Section: 2 / 3
// Project: 9
// Description: Main JS
//-------------------------------------------------
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


// Skybox
const skyboxGeometry = new THREE.SphereGeometry(200, 1000, 1000);
const skyboxMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load('./assets/background.jpg'),
  side: THREE.DoubleSide,
});

const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Textures
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./assets/ground.jpg');
const wallTexture = textureLoader.load('./assets/wall.jpg'); 

const texturedMaterial = new THREE.MeshPhongMaterial({ map: groundTexture });

// Ground
const planeGeometry = new THREE.CircleGeometry(10, 8);
const plane = new THREE.Mesh(planeGeometry, texturedMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Wall
const wallGeometry = new THREE.CylinderGeometry(4, 4, 0.1, 8, 1, false);
const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture, side: THREE.DoubleSide });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.rotation.x = -Math.PI / 2; 
wall.rotation.y = -3 * Math.PI / 2;
wall.position.set(0, 4, -8); 
scene.add(wall);

// Flag
const boxGeometry = new THREE.BoxGeometry(3,2,0); 
const boxTexture = textureLoader.load('./assets/flag.png'); 
const boxMaterial = new THREE.MeshPhongMaterial({ map: boxTexture });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 8, 0);
scene.add(box);

// Loaders
const loader = new OBJLoader();

// For Animation
const wolfObjects = [];

// Cutom Shader
const customShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    color: { value: new THREE.Color(0xffffff) },
  },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    varying vec3 vNormal;
    void main() {
      float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
      gl_FragColor = vec4(color * intensity, 1.0);
    }
  `,
});

//-------------------------------------------------
// Summary: Loads an object from the specified modelPath and places it in the scene
// with the given position, rotation, and scale.
// Precondition: 
// {string} modelPath - The path to the 3D model file.
// {object} position - The position {x, y, z} where the object will be placed.
// {object} rotation - The rotation {x, y, z} applied to the object.
// {number} scale - The scaling factor applied to the object.
// Postcondition: The 3D model is loaded asynchronously, assigned a white Phong material,
// scaled, positioned, and rotated according to the provided parameters. If the model is a wolf,
// it is added to the wolfObjects array. Finally, the model is added to the scene.
//-------------------------------------------------
function loadObject(modelPath, position, rotation, scale) {
  loader.load(modelPath, (object) => {
    const importedModel = object;
    

    importedModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = customShaderMaterial;
      }
    });

    importedModel.scale.set(scale, scale, scale);
    importedModel.position.set(position.x, position.y, position.z);
    importedModel.rotation.set(rotation.x, rotation.y, rotation.z);

    if (modelPath.includes('wolf.obj')) {
      wolfObjects.push(importedModel);
    }
    
    scene.add(importedModel);
  });
}

// Load Objects
loadObject('./assets/wolf.obj', { x: 5, y: 0, z: 6 }, { x: 0, y: -Math.PI/2, z: 0 }, 1/400); 
loadObject('./assets/wolf.obj', { x: -5, y: 0, z: 6 }, { x: 0, y: -Math.PI/2 , z:0}, 1/400);
loadObject('./assets/warrior1/warrior1.obj', { x: -7, y: 0, z: 0 }, { x: -Math.PI / 2, y: 0, z: Math.PI/2 }, 1);
loadObject('./assets/warrior1/warrior1.obj', { x: 7, y: 0, z: 0 }, { x: -Math.PI / 2, y: 0, z: -Math.PI/2 }, 1);
loadObject('./assets/warrior2/warrior2.obj', { x: -5, y: 0, z: -4.5 }, { x: -Math.PI / 2, y: 0, z: Math.PI/2 }, 1);
loadObject('./assets/warrior2/warrior2.obj', { x: 5, y: 0, z: -6 }, { x: -Math.PI / 2, y: 0, z: -Math.PI/2 }, 1);


// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation
function animate() {
  requestAnimationFrame(animate);

  // Flag Animation
  box.rotation.y += 0.01;

  // Wolf Animation
  wolfObjects.forEach((wolf) => {
    const movementAmount = 0.5; 
    const currentTime = Date.now() * 0.001;
    wolf.userData.initialPosition = wolf.userData.initialPosition || wolf.position.clone();
    const initialPosition = wolf.userData.initialPosition;
    wolf.position.z = initialPosition.z + movementAmount * Math.sin(currentTime);
    
    renderer.render(scene, camera);
  });
}

animate();



