import './index.css'
import * as THREE from 'three'
import { getPositionISS, convertLongitudeLatitudeToXYZ,getOverPlace} from './ISSPosition'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { Vector3 } from "three";
import * as dat from 'lil-gui'
import model from './assets/Models/ISS_2016.glb?url';
import fondo from "./assets/starsBackground.webp";
import day from './assets/earthDay.webp';
import night from './assets/earthNight.webp';
import clouds from './assets/earthClouds.webp'; 
import gsap from 'gsap'


// DATOS GENERALES
const config = {
    followISS: true,
    slider1: 0, 
}

let timeLabek = document.getElementsByClassName('TimeLabel')[0];
let overLabel = document.getElementsByClassName('overLabel')[0];
setInterval(() => {
    timeLabek.innerHTML = new Date().toUTCString();
}, 1000);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axis helper
const axesHelper = new THREE.AxesHelper( 5 );
axesHelper.visible = false
scene.add( axesHelper );


       
/**
 * Modelo de la ISS
 */
 const gltfLoader = new GLTFLoader();
 let ISSMODEL = null;
 gltfLoader.load(
   model,
   function ( gltf ) {

     ISSMODEL = gltf.scene.children[ 0 ];

     ISSMODEL.position.set( 0, 0, 2 );
     ISSMODEL.scale.set( 0.00005, 0.00005, 0.00005 );
     camera.position.set(
       ISSMODEL.position.x * 1.5,
       ISSMODEL.position.y * 1.5,
       ISSMODEL.position.z * 1.5
      );
     camera.lookAt( ISSMODEL.position );

     scene.add( ISSMODEL )
 
   },
 )
   




/**
 * GUI control
 */
const gui = new dat.GUI()
gui.add(config, 'followISS').name('Follow ISS')



// gui.add(axesHelper, 'visible').name("Axis Helper")

/**
 * Loader de texturas
 */

const textureLoader = new THREE.TextureLoader();

/**
 * Fondo del simulador
 */
textureLoader.load(fondo , function(texture)
{
    scene.background = texture; 
});

/**
 * TODO GROUP
 */
const sceneGroup = new THREE.Group();


 
function updateISSPOSITION(issDATA,LastPosition){
    if(config.slider1===0){
        if(LastPosition===undefined){
            ISSMODEL.position.set(issDATA.x ,issDATA.y ,issDATA.z)
        }else{
            gsap.to(ISSMODEL.position, { duration: 5, x: issDATA.x, y: issDATA.y, z: issDATA.z, ease: "power1.out" });
        }
    }
    lastPosition = [issDATA.x ,issDATA.y ,issDATA.z]
    
}


/**
 * Posicion real de la ISS
 * En coordenadas cartesianas
 */
let iss_data = {}
let issDATA = {}
// Call API to get ISS position every 5 seconds
let lastPosition = []
let trajectory = false
let coordinatesLabel = document.getElementsByClassName("CoordinatesLabel")[0];
setInterval(() => {
    getPositionISS().then(data => {
        iss_data = data
        issDATA = convertLongitudeLatitudeToXYZ(iss_data.iss_position.longitude, iss_data.iss_position.latitude, 2)
        coordinatesLabel.innerHTML = `Lat: ${iss_data.iss_position.latitude}° Long: ${iss_data.iss_position.longitude}°`
        if(!trajectory){
          trajectory = true
        //   getFutureISSPosition(iss_data.iss_position.latitude, iss_data.iss_position.longitude)
        } 
        updateISSPOSITION(issDATA,lastPosition)
    })
}, 5000);

function getOver(){
    try{

        getOverPlace(iss_data.iss_position.latitude, iss_data.iss_position.longitude)
        .then(data => {
            if(data){
    
                if(data['address']['state'] && data['address']['country']){
                    overLabel.innerHTML ='over: '+ data['address']['state'] + ', ' + data['address']['country']
                }else{
                    overLabel.innerHTML ='over: '+ data['display_name']
                }
            }
            else
                overLabel.innerHTML ='over: Ocean'
        }).catch(err => {
            overLabel.innerHTML ='over: Ocean'
        })
    }
    catch(err){
        overLabel.innerHTML ='over: Ocean'
    }
}


setInterval(() => {
    try{
        getOver()
    }catch(err){
        console.log(err)
    }
}, 5000); 




const dayNightShader = () => {
    return {
        vertex: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vSunDir;
        
        uniform vec3 sunDirection;
        
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
            vNormal = normalMatrix * normal;
            vSunDir = mat3(viewMatrix) * sunDirection;
        
            gl_Position = projectionMatrix * mvPosition;
        }
        `,
        fragment: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D cloudsTexture;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vSunDir;
        
        void main(void) {
            vec3 dayColor = texture2D(dayTexture, vUv).rgb;
            vec3 nightColor = texture2D(nightTexture, vUv).rgb;
            vec3 cloudsColor = texture2D(cloudsTexture, vUv).rgb;

            float cosineAngleSunToNormal = dot(normalize(vNormal), normalize(vSunDir));
        
            cosineAngleSunToNormal = clamp(cosineAngleSunToNormal * 5.0, -1.0, 1.0);
        
            float mixAmount = cosineAngleSunToNormal * 0.5 + 0.5;
        
            vec3 color = mix(nightColor, dayColor, mixAmount);

            vec3 finalColor = mix(color, cloudsColor, 0.15);

           
        
            gl_FragColor = vec4(finalColor, 1.0);
        }
        `
    }
}


const addEarth = () => {
    let earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    let earthMaterial = new THREE.ShaderMaterial({

        
        uniforms: {
            sunDirection: {
                value: new THREE.Vector3(0, 4, 0)
            },
            dayTexture: {
                value: textureLoader.load(day)
            },
            nightTexture: {
                value: textureLoader.load(night)
            },
            cloudsTexture: {
                value: textureLoader.load(clouds)
            }
        },

        vertexShader: dayNightShader().vertex,
        fragmentShader: dayNightShader().fragment
    });

   return new THREE.Mesh(earthGeometry, earthMaterial);
}

const EarthSphere = addEarth()
scene.add(EarthSphere)
    

EarthSphere.rotation.x = 90 * Math.PI / 180


const light3 = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light3);







/**
 * Tamaño del canvas
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Funcion para actualizar el tamaño del canvas

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camara
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
camera.up.set( 0, 0, 1 );



scene.add(EarthSphere)
scene.add(camera)
scene.add(sceneGroup)




// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
let seed = 0;
let seedx, seedy, seedz = 0;
const clock = new THREE.Clock()
const tick = () =>
{
    // Tiempo transcurrido
    const elapsedTime = clock.getElapsedTime()
    // Update controls
    controls.update()


    // ISSMODELGROUP.position.y = 1.5;
    // ISSMODELGROUP.position.x = 1.5;
    // ISSMODELGROUP.position.z = 1.5;


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

    
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)


    // Fixed light position
    // lightHolder.quaternion.copy(camera.quaternion)
}

tick()


