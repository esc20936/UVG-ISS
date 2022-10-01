import React from "react";
import ReactDOM from "react-dom/client";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";
import Info from "./Info.jsx";
import fondo from "./assets/starsBackground.webp";
import addEarth from "./Earth.jsx";
import * as dat from "lil-gui";
import { getPositionISS, convertLongitudeLatitudeToXYZ, updateISSPOSITION } from "./ISSPosition.jsx";


import "./index.css";

// Function to set all the scene elements
function init() {

  // Config for the GUI
  const config = {
    followISS: true,

  }




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

  // Canvas sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // GUI Controls
  const gui = new dat.GUI()
  gui.add(config, 'followISS').name('Follow ISS')
  
  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );

  // Camera position
  camera.up.set(0, 0, 1);



  // Texture Loader
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(fondo, function (texture) {
    scene.background = texture;
  });



  // Object Loader
  const gltfLoader = new GLTFLoader();
  let ISSMODEL = null;
  gltfLoader.load(
    "src/assets/Models/ISS_2016.glb",
    function ( gltf ) {

      ISSMODEL = gltf.scene.children[ 0 ];
      let newMaterial = new THREE.MeshPhongMaterial( { color: "#7a7a7a" } );

      ISSMODEL.material = newMaterial;

      ISSMODEL.position.set( 0, 0, 2 );
      ISSMODEL.scale.set( 0.00005, 0.00005, 0.00005 );
      camera.position.set(
        ISSMODEL.position.x * 1.5,
        ISSMODEL.position.y * 1.5,
        ISSMODEL.position.z * 1.5
       );
      camera.lookAt( ISSMODEL.position );

      scene.add( ISSMODEL )
  
      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Group
      // gltf.scenes; // Array<THREE.Group>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
  
    },

  )

  // Objects
  // Earth
  // let viewVector = new THREE.Vector3().subVectors( camera.position, object.glow.getWorldPosition());
  const EarthSphere = addEarth();
  EarthSphere.rotation.x = (90 * Math.PI) / 180;
  scene.add(EarthSphere);

  // Light
  const light1 = new THREE.DirectionalLight(0xe8e6e3, 0.5);
  light1.position.set(0, 4, 0);
  light1.lookAt(new Vector3());
  light1.castShadow = false;
  scene.add(light1);

  const light3 = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(light3);
  
  

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


  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



  // ISS Position Manager
let iss_data = {}
let issDATA = {}


// Call API to get ISS position every 5 seconds
let lastPosition = null
setInterval(() => {
    getPositionISS().then(data => {
        iss_data = data
        issDATA = convertLongitudeLatitudeToXYZ(iss_data.iss_position.longitude, iss_data.iss_position.latitude, 2)
        lastPosition = updateISSPOSITION(issDATA,lastPosition, ISSMODEL)
    })
}, 5000);




  // Animate
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);

    if(ISSMODEL != null){
      if(config.followISS){
        camera.position.set(
          ISSMODEL.position.x * 1.5,
          ISSMODEL.position.y * 1.5,
          ISSMODEL.position.z * 1.5
          );
          camera.lookAt( ISSMODEL.position );
      }
      ISSMODEL.lookAt(new Vector3(0,0,0))


      
    }

  };

  tick();
}

init();
