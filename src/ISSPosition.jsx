import gsap from "gsap";
function getPositionISS(){
    return fetch(`http://api.open-notify.org/iss-now.json`)
    .then((response) => { 
        return response.json().then((data) => {
            // console.log(data);
            return data;
        }).catch((err) => {
            console.log('Error al obtener la posicion de la ISS', err);
        }) 
    });


}

// Convert Longitude and Latitude to x y z coordinates
function convertLongitudeLatitudeToXYZ(lon=0,lat=0, R=2) {
    
    // convert latitude to radians 
    lat = lat * Math.PI / 180;
    lon = lon * Math.PI / 180;

    let x = R * Math.cos(lat) * Math.cos(lon)

    let y = R * Math.cos(lat) * Math.sin(lon)

    let z = R *Math.sin(lat)

    return {x, y, z}
}

function updateISSPOSITION(issDATA,LastPosition, ISSMODEL){
    if(LastPosition===undefined){
        ISSMODEL.position.set(issDATA.x ,issDATA.y ,issDATA.z)
    }else{
        // Animate movement of ISS bewteen last position and new position
        gsap.to(ISSMODEL.position, { duration: 5, x: issDATA.x, y: issDATA.y, z: issDATA.z, ease: "power1.out" });
    }
   return  [issDATA.x ,issDATA.y ,issDATA.z]

    
    // console.log(issDATA)
}

export {getPositionISS, convertLongitudeLatitudeToXYZ, updateISSPOSITION};