var gameMarker = null
var gameMarkerCoords = null

var worldPos = { lat: 38.67581309795492, lng: -121.1217851483374 };


function initialize() {
    // Starting center location for the map

    //const mapstart = { lat: -60, lng: 0};
    const mapstart = { lat: 38.67581309795492, lng: -121.1217851483374 }

    // Sets up our map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: mapstart,
        zoom: 2,
    });

    // Sets up street view
    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            position: mapstart,
            pov: {
                heading: 34,
                pitch: 10,
            },
        }
    );
    //map.setStreetView(panorama);

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
    const geocoder = new google.maps.Geocoder();
    codeAddress(geocoder)
}

function checkGuess() {
    latDist = gameMarker.getPosition().lat() - worldPos.lat
    lngDist = gameMarker.getPosition().lng() - worldPos.lng
    console.log(latDist)
    console.log(lngDist)
    guessDist = Math.sqrt(((latDist) * 69) ** 2 + ((lngDist) * 54.6) ** 2)  //Bad math
    distStr = `Distance: ${latDist} off latitude and ${lngDist} off longitude`
    distElement = document.getElementById('dist')
    distElement.textContent = distStr
    console.log(guessDist)
}

function codeAddress(geocoder) {
    geocoder.geocode({
        componentRestrictions: {
            country: 'AU',
            postalCode: '2000'
        }
    }, function (results, status) {
        if (status == 'OK') {
            console.log(results[0].geometry.location);
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            window.alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}