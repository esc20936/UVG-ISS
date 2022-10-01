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

// get future ISS position coords
function getFutureISSPosition(latitude, longitude ) {
    
}

export {getPositionISS, convertLongitudeLatitudeToXYZ, getFutureISSPosition};