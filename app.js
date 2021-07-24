var gameMarker = null
var gameMarkerCoords = null
var globs = {'map': null, 'pano': null, 'sv': null, 'answerFlag': null};
var worldPos = { lat: 0, lng: 0};
const mapstart = { lat: 0, lng: 0} //Where the map resets to each time

function initialize() {
    // Starting center location for the map

    // Sets up our map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: mapstart,
        zoom: 2,
    });
    globs.map = map

    // Sets up street view
    
    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            position: worldPos,
            pov: {
                heading: 34,
                pitch: 10,
            },
            showRoadLabels: false
        }
    );
    panorama.setOptions({
        showRoadLabels: false
    });
    var sv = new google.maps.StreetViewService()

    globs.pano = panorama
    globs.sv = sv
    // const geocoder = new google.maps.Geocoder();
    // codeAddress(geocoder)
    //map.setStreetView(panorama);
    randPlace()

    //This function controls the global marker that the player sets as their guess
    function setMarker(coords) {
        gameMarkerCoords = coords
        if (gameMarker != null) {
            gameMarker.setMap(null)
        }
        gameMarker = new google.maps.Marker({
                position: coords,
                map: map,
        });
    }

    // Listens for marker placement
    google.maps.event.addListener(map, 'click', function (event) {
        // Add marker
        setMarker(event.latLng);

    });
    
}

function coordConv(lat1, lat2, lon1, lon2){
    const R = 6371e3; // metres
    let o1 = lat1 * Math.PI/180; // φ, λ in radians
    let o2 = lat2 * Math.PI/180;
    let to = (lat2-lat1) * Math.PI/180;
    let ta = (lon2-lon1) * Math.PI/180;

    let a = Math.sin(to/2) * Math.sin(to/2) +
            Math.cos(o1) * Math.cos(o2) *
            Math.sin(ta/2) * Math.sin(ta/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c; // in metres
    return d/1609
}
function checkGuess() {
    guessDist = coordConv(gameMarker.getPosition().lat(), worldPos.lat, gameMarker.getPosition().lng(), worldPos.lng)
    distStr = `Distance: ${guessDist} Miles Off`
    distElement = document.getElementById('dist')
    distElement.textContent = distStr
    console.log(worldPos)
    globs.map.zoom = 15
    globs.map.setCenter(worldPos)
    globs.answerFlag = new google.maps.Marker({
        position: worldPos,
        map: globs.map,
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
});
}
function reset(){
    if (globs.answerFlag != null){
        globs.answerFlag.setMap(null)
        globs.map.zoom = 2
        globs.map.setCenter(mapstart)
        randPlace()
        distElement = document.getElementById('dist')
        distElement.textContent = `Distance: click on the map (last distance: ${distElement.textContent.split(' ')[1]} Miles)`
    }
    
}

// function processSVData({ data }) {
//     console.log(data.location);
//     globs.pano.setPano(data.location.pano);
//     worldPos = data.location.latLng;
//     console.log(`${data.location.latLng.lat()} ${data.location.latLng.lng()}`);
   
    
// }

// function codeAddress(geocoder) {
//     ranLat = (Math.random() * 150) - 75
//     ranLng = (Math.random() * 360) - 180
//     ranLat = parseFloat(ranLat.toFixed(3))
//     ranLng = parseFloat(ranLng.toFixed(3))
//     console.log(ranLat)
//     console.log(ranLng)
//     m = new google.maps.Marker({
//         position: {'lat':ranLat, 'lng':ranLng},
//         map: globs.map,
//     });
//     geocoder.geocode({
//         'latLng': {'lat':ranLat, 'lng':ranLng}
//     }, function (results, status) {
//         if (status == 'OK') {
//             loc = results[0].geometry.location 
//             // var newPos = {'lat':loc.lat(), 'lng':loc.lng()}
//             globs.sv.getPanorama({location: loc, radius: 100000}).then(processSVData)
            

//         } else {
//             window.alert('Geocode was not successful for the following reason: ' + status);
//         }
//     });
// }

function randPlace(){
    var ranLoc = randomLocations.all[Math.floor(Math.random()*randomLocations.all.length)];
    console.log(ranLoc)
    var ranLatLng = new google.maps.LatLng(ranLoc.lat, ranLoc.lng);
    globs.pano = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            position: ranLatLng,
            pov: {
                heading: 34,
                pitch: 10,
            },
        }
    );
    worldPos = {'lat': parseFloat(ranLoc.lat), 'lng': parseFloat(ranLoc.lng)}
}