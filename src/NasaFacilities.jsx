import * as THREE from 'three';
// import { convertLongitudeLatitudeToXYZ } from './ISSPosition';

const NASAS_FACILITIES = {
    'Fairbanks':{
        'lat': 64.8,
        'long': -147.5
    },
    'SSC':{
        'lat': 64.8,
        'long': -147.5
    },
    'Gilmore Creek':{
        'lat': 64.8,
        'long': -147.5
    },
    'Wallops':{
        'lat': 37.9,
        'long': -75.5
    },
    'KSAT' :{
        'lat': 78.229772,
        'long': 15.407786,
    },
    'SSC Sweden':{
        'lat': 67.857128,
        'long': 20.96,
    },
    'SSC Germany':{
        'lat': 49.54,
        'long': 8.66,
    },
    'KSAT Singapore':{
        'lat': 1.35,
        'long': 103.82,
    },
    'SSC SP HI':{
        'lat': 19.43,
        'long': -155.28,
    },
    'White Stands':{
        'lat':32.5056,
        'long':-106.6126,
    },
    'SSC Chile':{
        'lat':-33.45,
        'long':-70.67,
    },
    'KSAT Antartica':{
        'lat':-72.016,
        'long':2.53,
    },
    "Sansa South Africa":{
        'lat': -25.7487,
        'long': 28.2678,
    },
    'MacMurdo Antarctica':{
        'lat': -77.85,
        'long': 166.67,
    },
    'SSC Australia':{
        'lat': -29.08,
        'long': 115.58,
    },
}

function addFacilitiesToScene(scene){
    let facilities = []
    for(const key in NASAS_FACILITIES){
        let mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.05, 32, 32),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
        )
        let position = convertLongitudeLatitudeToXYZ(NASAS_FACILITIES[key].long, NASAS_FACILITIES[key].lat,1)
        mesh.position.set(position.x, position.y, position.z)
        facilities.push(mesh)
        scene.add(mesh)
    }
    
    return facilities
}


function setFacilitiesVisibility(v, scene, lista){
    if(v){
        lista.forEach((e) => {
            scene.add(e)
        })
    }else{
        lista.forEach((e) => {
            scene.remove(e)
        })
    }

}

export {NASAS_FACILITIES,addFacilitiesToScene, setFacilitiesVisibility};