
// ---[ Map  ]---

cerulean.map = {}
cerulean.map.bootstrap = function(){
    cerulean.map.view = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: -23.5607558, lng: -46.6597692},
        styles: mapStyles.Road,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        minZoom: 16,
        maxZoom: 18,
        scrollwheel: false,
        noClear: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    });

    cerulean.map.geocoder = new google.maps.Geocoder();

};

cerulean.map.doGeocoding = function(address, callback){

    cerulean.map.geocoder.geocode(
        {'address': address},
        function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            callback(results[0].geometry.location);
        } else {
            callback()
        }
    });

}
