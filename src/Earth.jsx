import * as THREE from "three";
import day from './assets/earthDay.webp';
import night from './assets/earthNight.webp';
import clouds from './assets/earthClouds.webp'; 

const dayNightShader = () => {
    return {
        vertex: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vSunDir;
        varying float intensity;
        uniform vec3 sunDirection;
        
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
            vNormal = normalMatrix * normal;
            vSunDir = mat3(viewMatrix) * sunDirection;
        
            gl_Position = projectionMatrix * mvPosition;

            intensity = pow(dot(normalize(vNormal), normalize(vSunDir)), 5.0);
            
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

            vec3 glow = vec3(0.0, 0.0, 82)*0.5;

            vec3 finalColor = mix(color, cloudsColor, 0.15);

            vec3 finalColor2 = mix(finalColor, glow, 0.0015);

           
        
            gl_FragColor = vec4(finalColor2, 1.0);
        }
        `
    }
}

const addEarth = () => {
  const textureLoader = new THREE.TextureLoader();

    let earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    let earthMaterial = new THREE.ShaderMaterial({

        // bumpScale: 5,
        // specular: new THREE.Color(0x333333),
        // shininess: 50,
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

export default addEarth;