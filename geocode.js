function codeAddress() {
  geocoder.geocode({
    componentRestrictions: {
      country: 'AU',
      postalCode: '2000'
    }
  }, function (results, status) {
    if (status == 'OK') {
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