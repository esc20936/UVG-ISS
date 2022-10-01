import React from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";
import Info from "./Info.jsx";
import fondo from "./assets/starsBackground.webp";
import "./index.css";


// Function to set all the scene elements
function init() {
  // Create Component to show info
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Info />
    </React.StrictMode>
  );

  // Canvas
  const canvas = document.querySelector("canvas.webgl");

  // Scene
  const scene = new THREE.Scene();

  // Texture Loader
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(fondo , function(texture)
  {
      scene.background = texture; 
  });

  // Objects
  // Earth
  const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000FF,    
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Light
 const light1 = new THREE.DirectionalLight(0xe8e6e3, 0.5);
 light1.position.set(0, 4, 0);
 light1.lookAt(new Vector3());
 light1.castShadow = false;
 scene.add(light1);
  


  // Canvas sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Function to resize the canvas
  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );

  // Camera position
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
  camera.up.set(0, 0, 1);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Animate
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
}

init();
